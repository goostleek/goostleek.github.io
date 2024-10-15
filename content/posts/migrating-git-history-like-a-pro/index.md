---
title: "Migrating Git History Like a Pro"
date: 2023-11-20T13:59:49+01:00
description: "Using Git patch files to copy file history between repositories"
featuredImg: "images/post-image.jpg"
tags: [ "git", "devops" ]
toc: true
scrollToTop: true
---

![Featured post image](images/post-image.jpg)

# Moving files between repositories

The challenge I recently had to tackle was splitting up a monorepo into smaller repositories by moving some files from
one repository to another. I know what you are thinking. How hard could it be? It sounds simple enough, but there was a
catch: I had to preserve the history of the moved files. This meant that I couldn't just copy the files over to the new
repository and call it a day. I had to find a way to transfer the files' history from one repository to another.

Before we delve into the solution, let's take a nostalgic trip back to the...

## ...early days of Git

Contrary to popular belief, Git wasn't designed for your fancy GUIs or those delightful merge conflicts you secretly
enjoy. No, it was created with a much humbler purpose in mind: managing patch files, really.

Picture this: the early 2000s, a world where Linux kernel development was akin to taming a wild beast. Contributors from
all corners of the globe, each with their unique and possibly conflicting changes, needed a way to collaborate without
pulling their hair out. Enter Git, the brainchild of [Linus Torvalds](https://www.wikiwand.com/en/Linus%20Torvalds), who
apparently didn't have enough fun creating Linux. Git was originally designed to streamline this chaotic process,
focusing on handling patch files efficiently.

In the golden days of kernel development, contributors would work on their local machines, make changes, and then
generate patch files. These weren't your average, run-of-the-mill patches for fixing tiny bugs. No, these were hefty
patches, sometimes as complex as a Shakespearean play, ready to be sent to
the [Linux kernel mailing list](https://www.wikiwand.com/en/Linux_kernel_mailing_list). Here, the patches would be
scrutinized, debated, and if you were lucky, accepted into the kernel codebase. This process, while seemingly archaic,
was incredibly effective in maintaining order in the chaotic world of open-source development.

Why am I dragging you through this history lesson, you ask? Well, understanding the roots of Git's patch-handling
capabilities is crucial for mastering the art of migrating files between repositories. So, buckle up, as we're about to
dive into the world of patch file generation and application, Git style. You'll learn how to wield the power of Git to
move files between repositories with the finesse of a kernel developer, minus the mailing list drama.

## Unleash the power of patch files

Now you know about patches. Git has a built-in command for generating
them, [`git format-patch`](https://git-scm.com/docs/git-format-patch). This command generates a patch file for each
commit in the specified range. Unfortunately, this command doesn't work for our use case, as we want to generate a patch
file for files, not a range of commits. But don't worry...

## ...`git log` to the rescue

You are using [this command](https://git-scm.com/docs/git-log) on a daily basis. It's a powerful tool for inspecting the
history of a repository. But did you know that it can also generate patch files? It can, and it's as simple as:

```bash
git log --format=email --patch --stat --reverse -- path/to/file path/to/other/file > patch.txt
```

It may look a bit intimidating, but
let's [break it down](https://explainshell.com/explain?cmd=git+log+--pretty%3Demail+--patch+--stat+--reverse+--+path%2Fto%2Ffile+path%2Fto%2Fother%2Ffile+%3E+patch.txt).
It will generate a patch file for each commit that touched the specified files. Let's go through the options one by one:

* [`--format=email`](https://git-scm.com/docs/git-log#Documentation/git-log.txt---formatltformatgt) - ensures that the
  patch file is in the correct `email` format (more on that later)
* [`--patch`](https://git-scm.com/docs/git-log#Documentation/git-log.txt---patch) - tells the command to generate the
  patch in the output
* [`--stat`](https://git-scm.com/docs/git-log#Documentation/git-log.txt---statltwidthgtltname-widthgtltcountgt) -
  includes file names the changes were made to in each commit (will be used to restore the file names in the target
  repository)
* [`--reverse`](https://git-scm.com/docs/git-log#Documentation/git-log.txt---reverse) - ensures that the commits are in
  chronological order (oldest first), the order in which we want to apply the patches in the target repository

Finally, the `--` option tells Git that the following arguments are paths to files we want to generate the patch for.
The output is redirected to a file called `patch.txt`. The file will contain a patch for each commit that touched the
specified files. Once we have the patch file, we can apply it to the target repository.

## Applying the patch

Ok, so we have a `patch.txt` file, but how do we apply it to the target repository? Well, we could use
the [`git apply`](https://git-scm.com/docs/git-apply) command, but there's a catch. The command does not create commits
for the changes it applies. This means that the file's history will not be preserved. We want to preserve the history,
so we need to use something else. Fortunately, there's a command that can do just
that: [`git am`](https://git-scm.com/docs/git-am). This command is designed to apply patches generated by
the [`git format-patch`](https://git-scm.com/docs/git-format-patch) command, but it can also apply patches generated by
the [`git log`]((https://git-scm.com/docs/git-log)) command. The only caveat is that the patch file must be in
the `email` format, which is why we used the `--format=email` option when generating the patch file.

Ok, enough talk, let's apply the patch. First, navigate to the target repository and make sure
it is in a clean state by running [`git status`](https://git-scm.com/docs/git-status). If there are any uncommitted
changes then stash (or commit) them. Once the repository is in a clean state, we can eventually apply the patch:

```bash
git am --committer-date-is-author-date < path/to/patch.txt
```

Mind
the [`--committer-date-is-author-date`](https://git-scm.com/docs/git-am#Documentation/git-am.txt---committer-date-is-author-date)
option. It ensures that the original commit dates are preserved. Without it, the commits would have the current date,
which is not what we want.

The patch application process may take some time, depending on the number of commits in the patch file. It will create a
commit for each patch from the patch file. Once the process is complete, you should see the commits in the target
repository.

Congratulations! You have successfully migrated the files along with their history 🚀.
