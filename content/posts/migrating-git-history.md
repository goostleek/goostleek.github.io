---
title: "Migrating Git History"
date: 2023-11-20T13:59:49+01:00
draft: true
description: "Migrating git files between repos with full history"
toc: true
tags: 
  - git
---

## Introduction

Welcome to the first post on my new blog! I'm so excited to share my knowledge with you. I hope you'll find it useful.
In this post, I'll show you how to migrate git history from one repository to another. Before we start, let's create a new repository on GitHub. I'll call it `migrating-git-history`. Then, let's clone it to our local machine:

```bash
#!/usr/bin/env bash

set -euo pipefail

readonly PROCESSING_DIR="${WORK_DIR:-work/.dependency-validator}"
readonly POM_FILE=${1:-pom.xml}
readonly CSV_FILE=${2:-"$PROCESSING_DIR/violations.csv"}
readonly DEPENDENCY_PATTERN=${3:-com.backbase.flow.*}

echo "Using POM_FILE: $POM_FILE"
echo "Will write CSV to $CSV_FILE"

[ ! -f "$POM_FILE" ] && echo >&2 "No such file: $POM_FILE" && exit 1

getNthLineAfterMatching() {
  # Get $1th line after matching /$2/ pattern
  awk "c&&!--c;/$2/{c=$1}" "$3"
}

cleanupArtifactName() {
  # Trim whitespaces around
  TRIMMED="$(xargs <<<"$1")"
  # then remove the "+-" prefix
  echo "${TRIMMED#"+-"}"
}

init() {
  mkdir -p "$PROCESSING_DIR"
  rm -f "$CSV_FILE" "$PROCESSING_DIR"/violation-*
  touch "$CSV_FILE"
}

validate() {
  echo "
  Validating dependencies (groupId: $DEPENDENCY_PATTERN), this may take a while...
  "
  mvn org.apache.maven.plugins:maven-enforcer-plugin:3.0.0-M3:enforce \
    -f "$POM_FILE" \
    -Drules=dependencyConvergence \
    -Denforcer.fail=false |
    sed -n "/Dependency convergence error for $DEPENDENCY_PATTERN/,/^$/p" \
      >"$PROCESSING_DIR/.enforcer.tmp"
}

postprocess() {
  awk -v RS= "{print > (\"$PROCESSING_DIR/violation-\" NR)}" "$PROCESSING_DIR/.enforcer.tmp"
  for violation in "$PROCESSING_DIR/violation-"*; do
    if [ -s "$violation" ]; then
      AFFECTED_ARTIFACT=$(cleanupArtifactName "$(getNthLineAfterMatching 2 and "$violation")")
      AFFECTED_ARTIFACT_NAME=$(cut -d':' -f2 <<<"$AFFECTED_ARTIFACT")
      AFFECTED_ARTIFACT_VERSION=$(cut -d':' -f3 <<<"$AFFECTED_ARTIFACT")
      OUTDATED_DEPENDENCY=$(cleanupArtifactName "$(tail -n1 "$violation")")
      OUTDATED_DEPENDENCY_VERSION=$(cut -d':' -f3 <<<"$OUTDATED_DEPENDENCY")
      AFFECTED_DEPENDENCY=$(cut -d':' -f1-2 <<<"$OUTDATED_DEPENDENCY")
      LATEST_DEPENDENCY=$(cleanupArtifactName "$(grep -m1 "$(cut -d':' -f2 <<<"$OUTDATED_DEPENDENCY")" <<<"$(tail -n +2 "$violation")")")
      LATEST_DEPENDENCY_VERSION=$(cut -d':' -f3 <<<"$LATEST_DEPENDENCY")
      echo "Artifact '$AFFECTED_ARTIFACT' is using outdated dependency:
        $AFFECTED_DEPENDENCY:$OUTDATED_DEPENDENCY_VERSION (latest is $LATEST_DEPENDENCY_VERSION)"
      CVS_ROW="$AFFECTED_ARTIFACT_NAME,$AFFECTED_ARTIFACT_VERSION,$AFFECTED_DEPENDENCY,$OUTDATED_DEPENDENCY_VERSION,$LATEST_DEPENDENCY_VERSION"
      echo "$CVS_ROW" >>"$CSV_FILE"
    else
      echo "No violations for '$DEPENDENCY_PATTERN' groupId pattern detected"
      break
    fi
  done
}

init
validate
postprocess
if [ -s "$CSV_FILE" ]; then
  echo "
--------------------------------------------------------------------------------------------------------------------------
You can find the details for further processing
in $CSV_FILE
The format of the file is CSV in the form
AFFECTED_ARTIFACT_NAME,AFFECTED_ARTIFACT_VERSION,AFFECTED_DEPENDENCY,OUTDATED_DEPENDENCY_VERSION,LATEST_DEPENDENCY_VERSION
Each line represents affected dependency for the given artifact
--------------------------------------------------------------------------------------------------------------------------
"
fi
 
```
