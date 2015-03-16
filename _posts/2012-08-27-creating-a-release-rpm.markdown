---
layout: post
title: "Creating a release RPM"
date: 2012-08-27 23:56
comments: true
categories:
---

Here is an example of a release RPM we used for a project

{% highlight bash %}
#
# spec file for VoxeoLabs Yum Repo
#
Summary: Voxeolabs repository configuration
Name: voxeolabs
Version:        0.0.1
Release:        1%{?dist}
License:        GPLv3
Group: System Environment/Base

URL:            http://yum.voxeolabs.net/
Source0:        http://yum.voxeolabs.net.s3.amazonaws.com/pub/voxeolabs-0.0.1.el.tgz

BuildRoot: %{_tmpdir}/%{name}-%{version}-%{release}

Vendor: Voxeo Labs
Packager: John Dyer <jdyer@voxeo.com>

%description
This package contains the Voxeo Labs yum repo.  It includes the  GPG key as well as configuration for yum.

%prep
%setup -q

%build

%install
rm -rf $RPM_BUILD_ROOT
mkdir -p $RPM_BUILD_ROOT%{_sysconfdir}/yum.repos.d/
mkdir -p $RPM_BUILD_ROOT%{_sysconfdir}/pki/rpm-gpg/
cp -p voxeo-labs.repo $RPM_BUILD_ROOT%{_sysconfdir}/yum.repos.d/
cp -p RPM-GPG-KEY-voxeo-labs $RPM_BUILD_ROOT%{_sysconfdir}/pki/rpm-gpg/

%clean
rm -rf $RPM_BUILD_ROOT

%files
%defattr(-,root,root,-)
/etc/yum.repos.d/voxeo-labs.repo
/etc/pki/rpm-gpg/RPM-GPG-KEY-voxeo-labs

%post

# Retrieve Platform and Platform Version

if [ -f "/etc/redhat-release" ];
then
  platform=$(sed 's/^\(.\+\) release.*/\1/' /etc/redhat-release | tr '[A-Z]' '[a-z]')
  platform_version=$(sed 's/^.\+ release \([.0-9]\+\).*/\1/' /etc/redhat-release)

  # If /etc/redhat-release exists, we act like RHEL by default
  if [ "$platform" = "fedora" ];
  then
    # Change platform version for use below.
    platform_version="6.0"
  fi
  platform="el"
elif [ -f "/etc/system-release" ];
then
  platform=$(sed 's/^\(.\+\) release.\+/\1/' /etc/system-release | tr '[A-Z]' '[a-z]')
  platform_version=$(sed 's/^.\+ release \([.0-9]\+\).*/\1/' /etc/system-release | tr '[A-Z]' '[a-z]')
  # amazon is built off of fedora, so act like RHEL
  if [ "$platform" = "amazon linux ami" ];
  then
    platform="el"
    platform_version="6.0"
  fi
fi

sed -i -e "s/\$releasever/`echo $platform_version | cut -d. -f1`/g" /etc/yum.repos.d/voxeo-labs.repo
yum clean all

%changelog
* Sun Aug 27 2012 John Dyer <jdyer@voxeo.com> 0.0.1
- Initial release

{% endhighlight %}
