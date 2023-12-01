---
title: "Migrating Git History Like a Pro"
date: 2023-11-20T13:59:49+01:00
draft: true
description: "Using Git patch files to copy file history between repositories"
images: [ "posts/migrating-git-history-like-a-pro/images/post-image.jpg" ]
tags: [ "git", "devops" ]
toc: true
scrollToTop: true
---

![Featured post image](images/post-image.jpg)

# Moving files between repositories

The challenge I recently had to tackle was splitting up a monorepo into smaller repositories by moving some files from
one repository to another. I know what you are thinking. How hard could it be? It sounds simple enough, but there was a
catch: I had to preserve the file's history. This meant that I couldn't just copy the file over to the new repository
and call it a day. I had to find a way to transfer the file's history from one repository to another.

Before we delve into the solution, let's take a nostalgic trip back to the origins of Git.

## Early days of Git

Contrary to popular belief, Git wasn't designed for your fancy GUIs or those
delightful merge conflicts you secretly enjoy. No, it was created with a much humbler purpose in mind: managing patch
files.

Picture this: the early 2000s, a world where Linux kernel development was akin to taming a wild beast. Contributors from
all corners of the globe, each with their unique and possibly conflicting changes, needed a way to collaborate without
pulling their hair out. Enter Git, the brainchild of Linus Torvalds, who apparently didn't have enough fun creating
Linux. Git was originally designed to streamline this chaotic process, focusing on handling patch files efficiently.

In the golden days of kernel development, contributors would work on their local machines, make changes, and then
generate patch files. These weren't your average, run-of-the-mill patches for fixing tiny bugs. No, these were hefty
patches, sometimes as complex as a Shakespearean play, ready to be sent to the Linux kernel mailing list. Here, the
patches would be scrutinized, debated, and if you were lucky, accepted into the kernel codebase. This process, while
seemingly archaic, was incredibly effective in maintaining order in the chaotic world of open-source development.

Why am I dragging you through this history lesson, you ask? Well, young Padawan, understanding the roots of Git's
patch-handling capabilities is crucial for mastering the art of migrating files between repositories. So, buckle up, as
we're about to dive into the world of patch file generation and application, Git style. You'll learn how to wield the
power of Git to move files between repositories with the finesse of a kernel developer, minus the mailing list drama.

# Migrating files between repositories using Git's patch files?
