---
layout: post
title: "Ohai, Vagrant and eth1... Making them work in harmony"
date: 2013-09-26 22:34
categories: chef, vagrant, ohai
---

Unfortunately [Vagrant](http://vagrantup.com/) deployments always have the NAT adapter on eth0, which can cause headaches at times, especially when doing a multiVM deployment! Most of the time you end up having to modify the recipe to make things work. In my humble opinion these changes kind of defeat the purpose of testing in Vagrant to begin with. So what to do ? We’ll you can use an [Ohai plugin](http://wiki.opscode.com/display/chef/Writing+Ohai+Plugins) and override the `node.ipaddress` value ! So what we’ll do is make _eth1_ pretend to be _eth0_ !

Now since I want to make sure my cookbooks are the same in development as production I will want to make sure we don’t use this plugin in production. That being the case we’ll go ahead and add some guards to ensure this is only loaded when we are on a VirtualBox VM. Just for good measure we’ll also check for the vagrant user, and make sure that there is in fact an eth1 adapter. I feel this is enough of a safe guard to ensure we only apply this plugin if running under Vagrant, and only when needed.

{% highlight ruby %}
provide "ipaddress"
require_plugin "#{os}::network"
require_plugin "#{os}::virtualization"
require_plugin "passwd"

if virtualization["system"] == "vbox"
  if etc["passwd"].any? { |k,v| k == "vagrant"}
    if network["interfaces"]["eth1"]
      network["interfaces"]["eth1"]["addresses"].each do |ip, params|
        if params['family'] == ('inet')
          ipaddress ip
        end
      end
    end
  end
end
{% endhighlight %}

We can now distribute this w/ the [Ohai Plugin Cookbook](http://wiki.opscode.com/display/chef/Distributing+Ohai+Plugins) and not have to make any changes regardless of the environment ( Production / Development ).
