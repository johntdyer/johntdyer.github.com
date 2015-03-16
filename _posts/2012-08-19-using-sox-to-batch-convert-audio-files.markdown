---
layout: post
title: "Using SOX to batch convert audio files"
date: 2012-08-19 22:30
comments: true
categories: [SOX, Bash]

---
The Plain old telephone service (POTS) we are all used to is almost a hundred years old so when it comes to audio codecs you get pretty much the bottom of the barrel. When doing IVR you will want to make sure you convert all your media to the lowest common denominator, which is generally 8bit, 8Khz Mono. Doing this w/ SOX is pretty simple

{% highlight bash %}

for i in *.wav
do
 sox $i -r 8000 -U -b 8 new-files/$(basename $i)
done
{% endhighlight %}

Thats pretty much it ! If you are using OSX you can get SOX by installing Homebrew and running:

{% highlight bash %}

brew install sox
{% endhighlight %}


Hope that helps someone

-John
