---
title: "Query Chef's RestAPI using Spice"
description: "Dan Ryan has an awesome gem on Github called Spice , which is a nice wrapper to the Chef Severs RestAPI.  The one thing I didn’t find clearly documented was how"
pubDate: 'Dec 11, 2011'
tags: ['general']
---
[Dan Ryan](https://github.com/danryan) has an awesome gem on Github called [Spice](https://github.com/danryan/spice) , which is a nice wrapper to the [Chef Severs RestAPI](http://wiki.opscode.com/display/chef/Server+API).  The one thing I didn’t find clearly documented was how to do a search based on things such as environment, roles, and run lists.  However after a bit of digging I was able to get this working and I felt obliged to share w/ the class. The first thing you need to do is setup the Spice connection.  This part of pretty straight forward and of course well documented:

```ruby
  Spice.setup do |s|
    s.server_url  = "http://chef.server.net"
    s.client_name = "client-key"
    s.key_file    = "#{File.dirname(__FILE__)}/keys/client-key.pem"
  end
```


Then you perform the query using Spice.connection.get
```ruby
  results = Spice.connection.get('/search/node', :params => {:q => "role:base AND role:rayo_gateway AND chef_environment:ec2_rayo_functional_tests"})["rows"]
```


This will return a collection that you can easily iterate over to get the ‘goods’

```ruby
require 'spice'

Spice.setup do |s|
  s.server_url  = "http://chef.server.net"
  s.client_name = "client-key"
  s.key_file    = "#{File.dirname(__FILE__)}/keys/client-key.pem"
end


results = Spice.connection.get('/search/node', :params => {:q => "role:base AND role:rayo_gateway AND chef_environment:ec2_rayo_functional_tests"})["rows"]

results.each do |node|
  puts node["automatic"]["ec2"]["public_ipv4"]
end
```

The great thing is this not only contains the node’s attributes and run lists but it also contains all the Ohai data for each node.  This is some powerful stuff, hope you enjoy!
