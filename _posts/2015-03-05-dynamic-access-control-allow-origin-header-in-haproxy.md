---
layout: post
title: "Dynamic Access Control Allow Origin header in HAProxy"
description: "Supporting dynamic Access-Control-Allow-Origin based on the requesting Origin header"
category: haproxy
tags: [haproxy]
---

In order to support Preflight CORS request in HAProxy you need to return the correct `Access-Control-Allow-Origin` header in the response.  This should contain the domain in the Origin header from the request.  We had a backend service which did not support Preflight CORS requests and we decided to try and handle this in HAProxy.

In order to do this we have to capture the Origin header and then return that captured field conditionally.  If there is no Origin header we don't return the CORS headers at all.

{% highlight ruby %}
listen http-in
    mode http
    listen *:80

    # Add CORS headers when Origin header is present
    capture request header origin len 128
    http-response add-header Access-Control-Allow-Origin %[capture.req.hdr(0)] if { capture.req.hdr(0) -m found }
    rspadd Access-Control-Allow-Headers:\ Origin,\ X-Requested-With,\ Content-Type,\ Accept  if { capture.req.hdr(0) -m found }
{% endhighlight %}
