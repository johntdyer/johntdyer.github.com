---
layout: post
title: "Print letters up to n in Ruby"
date: 2012-01-02 22:20
comments: true
categories: [Ruby]
---

Had a case the other day where I needed to create users accounts in a specific fashion. If I had less then 25 users I would use letters for the test accounts (eg: usera, userb, ect), if there were more then 25 I would use numbered accounts (eg: user1, user2, ect ) The problem was there could be any number of user accounts and I wanted to keep to this schema.

Unfortunately Enumerable wasn’t going to make this as easy as most things are in ruby, like this wasn’t going to work:

{% highlight ruby %}
"a".upto(5)
{% endhighlight %}

However I figured I could just switch to their ascii equivalent and then this would be easy!

{% highlight ruby %}
num_of_users = 25
if num_of_users <= 25
  (97..97+num_of_users).each{|e| puts e.chr}
else
  num_of_users.times{|e| puts e}
end
{% endhighlight %}

Worked like a charm!

