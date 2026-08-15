#!/usr/bin/env perl
# Replace the elite quiz arrays for chapters 1 and 2 with the 5-option versions.
use strict; use warnings;

open my $f, "<", "REALITY-FOREX-TRADING-/os/js/data.js" or die $!;
local $/; my $data = <$f>;

sub splice_quiz {
  my ($chStart, $chEnd, $quizFile, $label) = @_;
  my $region = substr($data, $chStart, $chEnd - $chStart);
  my $ei = index($region, "elite: {");
  die "$label: elite block not found" if $ei < 0;
  my $tail = substr($region, $ei);
  if ($tail !~ s/(quiz: \[)(.*?)(\n      \],\n      native:)/$1 . $2 . $3/se) {
    die "$label: quiz pattern not found";
  }
  open my $qf, "<", $quizFile or die "cannot read $quizFile: $!";
  local $/; my $newQuiz = <$qf>;
  $newQuiz =~ s/,\s*\z//;          # drop trailing comma on last question
  $newQuiz =~ s/^\s+//;            # trim leading whitespace
  $newQuiz =~ s/\s+\z//;           # trim trailing whitespace
  my $replaced = "$1\n$newQuiz$3";
  $tail =~ s/(quiz: \[)(.*?)(\n      \],\n      native:)/$replaced/se;
  substr($data, $chStart, $chEnd - $chStart) = substr($region, 0, $ei) . $tail;
  print "$label: elite quiz replaced\n";
}

my $s1 = index($data, "id: 1, title:");
my $e1 = index($data, "id: 2, title:");
splice_quiz($s1, $e1, ".freebuff/tools/elite-quiz-ch1.js", "ch1");

my $s2 = index($data, "id: 2, title:");
my $e2 = index($data, "id: 3, title:");
splice_quiz($s2, $e2, ".freebuff/tools/elite-quiz-ch2.js", "ch2");

open my $o, ">", "REALITY-FOREX-TRADING-/os/js/data.js" or die $!;
print $o $data;
print "written OK\n";
