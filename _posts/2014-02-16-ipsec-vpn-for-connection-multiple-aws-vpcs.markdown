---
layout: post
title: "IPSEC VPN for connection multiple AWS VPC's"
date: 2014-02-16 15:45:49 -0500
comments: true
categories: [vpc, aws, ipsec, vpn]
---

Getting a VPN working to connect multiple regions is actually pretty simple.  I'll lay out the step's I used to get this working and hopefully it helps someone else.

* Setup security groups

{% highlight bash %}
ec2-create-group ipsec_east -d "Ipsec East" -c <vpc_id> --region us-east-1
ec2-create-group ipsec_west -d "Ipsec West" -c <vpc_id> --region us-west-2
ec2-authorize ipsec_east --protocol udp -p 4500 --region us-east-1 --cidr 0.0.0.0/0
ec2-authorize ipsec_east --protocol udp -p 500 --region us-east-1 --cidr 0.0.0.0/0
ec2-authorize ipsec_west --protocol udp -p 4500 --region us-west-2 --cidr 0.0.0.0/0
ec2-authorize ipsec_west --protocol udp -p 500 --region us-west-2 --cidr 0.0.0.0/0
# Note you can set the cidr address to be the other elastic IP, this would probably be the more secure thing to do, but for demonstrative purposes I didn't
{% endhighlight %}

* Deploy 2 small instances. I used two CentOS 6.4 [AMI's](https://aws.amazon.com/marketplace/pp/B00DGYP804/ref=sp_mpg_product_title?ie=UTF8&sr=0-4).  Use the security groups from step 1, and in my example I am deploying one in east and one in west-2:

{% highlight bash %}
ec2-run-instances ami-bf5021d6 -t t1.small -s subnet-xxxxxxxx -k my-key-pair -g sg-xxxxxxxx --region us-east-1
ec2-run-instances ami-b3bf2f83 -t t1.small -s subnet-xxxxxxxx -k my-key-pair -g sg-xxxxxxxx --region us-west-1
{% endhighlight %}

* Allocate two Elastic IP's, one in east and one in west

{% highlight bash %}
ec2-allocate-address -d vpc --region region us-east-1
ec2-allocate-address -d vpc --region region us-west-2
{% endhighlight %}

* Assign elastic IP's from step 3 to the instances created in step 1.

{% highlight bash %}
ec2-associate-address -i <instance_id> --region us-east-1
ec2-associate-address -i <instance_id> --region us-west-2
{% endhighlight %}

* Turn off source destination checks for each instance

{% highlight bash %}
ec2-modify-instance-attribute <instance_id> --source-dest-check false --region us-east-1
ec2-modify-instance-attribute <instance_id> --source-dest-check false --region us-west-2
{% endhighlight %}

* Edit /etc/sysctl.conf and comment out, or add, the following lines:
{% highlight bash %}
net.ipv4.ip_forward=1
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0
net.ipv4.conf.eth0.send_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.eth0.accept_redirects = 0
{% endhighlight %}

* Enable sysctl changes from the previous step
    `sudo sysctl -p /etc/sysctl.conf`

* install openswan
    `yum -y install openswan`

* Uncoment ipsec.d setting inside __/etc/ipsec.conf__
    `sed -i -e "s_#include /etc/_include /etc/_" /etc/ipsec.conf`

So for the remainder of this example we are going to esablish some "facts" to help.

{% highlight ruby %}
# Instance West:
west_elastic_ip: 11.22.33.44
west_private_ip: 10.10.0.10
west_vpc_subnet_cidr: 10.10.0.0/16

# Instance East:
east_elastic_ip: 55.66.77.88
east_private_ip: 10.1.0.10
east_vpc_subnet_cidr: 10.1.0.0/16
{% endhighlight %}

* So using these values we'll go ahead and create the tunnel configs on each instance:

## west-east.conf
### /etc/ipsec.d/west-east.conf
{% highlight ruby %}
conn west-east
   authby=secret
   auto=start
   type=tunnel
   left=10.10.0.10
   leftid=11.22.33.44
   leftsubnet=10.10.0.0/16
   right=55.66.77.88
   rightsubnet=10.1.0.0/16
   ike=aes256-sha1;modp2048
   dpddelay=30
   dpdtimeout=120
   dpdaction=restart

{% endhighlight %}

## east-west.conf
### /etc/ipsec.d/east-west.conf

{% highlight ruby %}
conn east-west
   authby=secret
   auto=start
   type=tunnel
   left=10.1.0.10
   leftid=55.66.77.88
   leftsubnet=10.1.0.0/16
   right=11.22.33.44
   rightsubnet=10.10.0.0/16
   ike=aes256-sha1;modp2048
   dpddelay=30
   dpdtimeout=120
   dpdaction=restart
{% endhighlight %}

- Next we'll want to go ahead and setup the shared secret between the two instances.

  - ### West
  `echo '11.22.33.44 44.55.66.77: PSK "super_secure_key"' > /etc/ipsec.secrets`

  - ### East
  `echo '44.55.66.77 11.22.33.44: PSK "super_secure_key"' > /etc/ipsec.secrets`

- Verify config, and make sure there are no FAILED items

{% highlight bash %}
[root@vpn1 ~]# sudo ipsec verify
Checking your system to see if IPsec got installed and started correctly:
Version check and ipsec on-path                               [OK]
Linux Openswan U2.6.32/K2.6.32-358.el6.x86_64 (netkey)
Checking for IPsec support in kernel                          [OK]
 SAref kernel support                                         [N/A]
 NETKEY:  Testing for disabled ICMP send_redirects            [OK]
NETKEY detected, testing for disabled ICMP accept_redirects   [OK]
Checking that pluto is running                                [OK]
 Pluto listening for IKE on udp 500                           [OK]
 Pluto listening for NAT-T on udp 4500                        [OK]
Two or more interfaces found, checking IP forwarding          [OK]
Checking NAT and MASQUERADEing                                [OK]
Checking for 'ip' command                                     [OK]
Checking /bin/sh is not /bin/dash                             [OK]
Checking for 'iptables' command                               [OK]
Opportunistic Encryption Support                              [DISABLED]
[root@vpn1 ~]#
{% endhighlight %}

- chkconfig and start services on both servers
{% highlight bash %}
sudo service ipsec status
sudo chkconfig ipsec on
sudo service ipsec stop
sudo service ipsec start
{% endhighlight %}

- Setup routes in each VPC to route traffic over the VPN instance.  Some illustrations to help with this part can be found [here](http://aws.amazon.com/articles/5472675506466066#_Toc331599186)

{% highlight bash %}
ec2-create-route <route_table_id> -r 10.10.0.0/16  -i <west_instance_id> --region us-west-2
ec2-create-route <route_table_id> -r 10.1.0.0/16 -i <east_instance_id> --region us-east-1
{% endhighlight %}

- Profit

At this point you should be able to connect to an instance in west and ssh to an instance in east.  Make sure your security groups in east have SSH open for the new origin IP ( 10.10.0.10/32 ).

## References:

* http://www.onepwr.org/2012/08/20/link-amazon-vpcs-over-a-ipsec-site-to-site-vpn/
* https://gist.github.com/winhamwr/2871257
* http://aws.amazon.com/articles/5472675506466066
