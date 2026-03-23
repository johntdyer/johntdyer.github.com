---
title: "Dynamic templates based on search results"
description: "So here is my use case, I have a two nodes which have to be configured to know about each other, but I can’t use multicast, and I want to be elastic, in that I "
pubDate: 'Dec 13, 2011'
tags: ['general']
---
So here is my use case, I have a two nodes which have to be configured to know about each other, but I can’t use multicast, and I want to be elastic, in that I can add a node and the others configs get updated. So to start we are going to have two nodes, gateway1 and gateway2, and each has a config file called sipmethod.xml which contains a node of XML data that defines the cluster.

```xml
 <Cluster>
   <Node name="gateway2" local="10.72.111.116:47520">
      <Peer remote="10.110.234.150:47520"/>
   </Node>
 </Cluster>
```

and here is my template that creates this section (sorta):

```ruby
<% if node[:prism][:sipmethod][:cluster] %>
 <Cluster>
   <Node name="<%=node[:hostname]%>" local="<%=node[:ipaddress]%>:<%= node[:prism][:sipenv][:rmi_port] %>">
     <% search(:node, "role:rayo_gateway AND chef_environment:#{node.chef_environment}").each do |peer| %>
      <Peer remote="<%= (peer.ec2 ? peer.ec2.local_ipv4 : peer.ipaddress) %>:<%= node[:prism][:sipenv][:rmi_port] %>"/>
     <%end%>
   </Node>
 </Cluster>
 <%end%>
```
Now there is one problem with this approach, if you look carefully the peers are going to include itself, which is not going to work.

```xml
 <Cluster>
   <Node name="gateway2" local="10.72.111.116:47520">
      <Peer remote="10.110.234.150:47520"/>
      <Peer remote="10.72.111.116:47520"/>  <!-- PROBLEM -->
   </Node>
 </Cluster>
```
I need to not include the node running the search in the results, and this is actually pretty simple:

We are going to take this search and simply add a NOT clause:

```ruby
 search(:node, "role:rayo_gateway AND chef_environment:#{node.chef_environment} NOT name:#{node.name}")
```

This will result in returning every gateway in my environment except the one running the search, and the end result is the dynamically configured cluster config:

```xml
 <Cluster>
   <Node name="gateway2" local="10.72.111.116:47520">
      <Peer remote="10.110.234.150:47520"/>
   </Node>
 </Cluster>
```
