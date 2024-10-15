---
title: "Broken Git 2.47 Windows Release"
date: 2024-10-11T16:52:28+02:00
description: "Why tests are important and how they could have prevented the Git 2.47 Windows release disaster"
featuredImg: "images/post-image.jpg"
tags: [ "git" ]
toc: true
scrollToTop: true
---

![Featured post image](images/meme.jpg)

## :coffee: It all happened last Monday morning...

I was just about to start the day as usual, with a fresh laptop boot and a cup of
coffee. Then, I updated all my CLI apps by running [
`scoop update --all`](https://github.com/ScoopInstaller/Scoop?tab=readme-ov-file#what-does-scoop-do). Yes, I like living
on the edge, I hear you thinking. Among all the apps being updated, I noticed the new Git was out! I was excited to see
what new features and bug fixes were included in this release. I quickly navigated to
the [release notes](https://github.blog/open-source/git/highlights-from-git-2-47/) only to find there was nothing of
particular interest for me this time. After this usual routine, I started my work with PR reviews.

Before continuing with my daily tasks, as always, I ran a [`git pull`](https://explainshell.com/explain?cmd=git+pull) on
the repository I was working on and took a sip of coffee. The operation usually finishes before I put the cup back on
the table. But this time, it did not finish after a couple of minutes, so I pressed `ctrl-c` to abort the operation and
retried...

To my surprise, the operation did not complete again. I was puzzled. My first thought was that I’d encountered a
temporary GitHub glitch or outage, but the [githubstatus.com](https://githubstatus.com) page was all green. Then, I
thought it might be my internet connection, but I was able to browse the web without any issues. Googling for similar
problems yielded no results, but I found [github-debug.com](https://github-debug.com), and I tried the suggested
troubleshooting steps, only to find the operation still hanging.

```bash
GIT_TRACE=1 GIT_TRANSFER_TRACE=1 git clone git@github.com:github/debug-repo /tmp/debug-repo-ssh
```

That was enough troubleshooting at the moment.

## :man_facepalming: I quit...

As a last resort, I checked the official _Git for Windows_ issue tracker
on GitHub and found [the culprit](https://github.com/git-for-windows/git/issues/5199). Honestly, I didn’t expect it to
be a problem with Git itself but rather with the Windows subsystem or some other software on my machine, possibly even
my VPN. But the issue was confirmed by many other users, and indeed, the problem was with Git. Yes, the new 2.47 release
was broken. A regression in the upgraded [MSYS2](https://www.msys2.org/docs/what-is-msys2/) runtime caused Git to hang
during SSH operations. I immediately downgraded to the previous version and continued my work (as of the time of writing
this post, the issue still hasn’t been fixed).

## :boom: ...but the disaster could have been prevented

This incident reminded me of the importance of testing. Don't get me wrong. I know that the Git project has a huge test
suite and that their release process is very strict. But still, this regression slipped through. I can only imagine how
many users were affected by this issue. Multiply the number of affected users by the average time spent troubleshooting,
and you can estimate how much potential company revenue was lost due to the inability to work with Git. As soon as the
issue was reported, the Git
team [immediately started working hard to nail down the root cause](https://github.com/git-for-windows/git/issues/5199#issuecomment-2405471159)
and apply [the fix](https://github.com/git-for-windows/msys2-runtime/pull/75). But the damage had already been done. It
could have been prevented by running the test suite on the Windows platform before the release. I'm sure the Git team
will learn from this incident and improve their release process to prevent similar issues in the future.
