#!/usr/bin/perl
# lane-depth-report.pl — per-chapter, per-lane depth table from data.js
# Usage: perl .freebuff/tools/lane-depth-report.pl [path/to/data.js]
use strict; use warnings;
my $file = shift || "REALITY-FOREX-TRADING-/os/js/data.js";
open my $fh, "<", $file or die "cannot read $file: $!";
my ($ch, $lane, $inQuiz);
my (%stdTitle, %stdSlides, %stdQuiz, %lanSlides, %lanQuiz);
while (<$fh>) {
  my $l = $_;
  if ($l =~ /^\s*(?:\{\s*)?id:\s*(\d+),/) {
    $ch = $1; $lane = ""; $inQuiz = 0;
    $stdTitle{$ch} = ($l =~ /title:\s*"([^"]+)"/) ? $1 : "";
    $stdSlides{$ch} = $1 if $l =~ /slides:\s*(\d+)/;
  }
  elsif ($l =~ /^\s*(challenging|elite):\s*\{/) { $lane = $1; $lanSlides{$ch}{$lane} //= 0; $lanQuiz{$ch}{$lane} //= 0; }
  elsif ($l =~ /^\s*\},\s*$/) { $lane = ""; $inQuiz = 0; }
  elsif ($l =~ /^\s*quiz:\s*\[/) { $inQuiz = 1; }
  elsif ($l =~ /^\s*slides:\s*(\d+),/) {
    if ($lane) { $lanSlides{$ch}{$lane} = $1; }
    else { $stdSlides{$ch} = $1; }
  }
  if ($inQuiz && $lane) { $lanQuiz{$ch}{$lane}++ if $l =~ /\{\s*q:\s*"/; }
  elsif ($inQuiz) { $stdQuiz{$ch}++ if $l =~ /\{\s*q:\s*"/; }
}
close $fh;
printf "%-4s %-28s %12s %12s %12s %12s\n", "ch", "title", "std sl/q", "chal sl/q", "elite sl/q", "notes";
my (@thinC, @thinE);
for my $c (sort { $a <=> $b } keys %stdSlides) {
  my $cs = $lanSlides{$c}{challenging} || 0; my $cq = $lanQuiz{$c}{challenging} || 0;
  my $es = $lanSlides{$c}{elite} || 0;      my $eq = $lanQuiz{$c}{elite} || 0;
  my $note = "";
  if ($cq < 8) { $note .= " CHAL-QUIZ-THIN"; push @thinC, $c; }
  if ($eq < 8) { $note .= " ELITE-QUIZ-THIN"; push @thinE, $c; }
  if ($cs < 20) { $note .= " CHAL-SLIDES-LOW"; }
  if ($es < 20) { $note .= " ELITE-SLIDES-LOW"; }
  printf "%-4d %-28s %6d/%-5d %6d/%-5d %6d/%-5d %s\n", $c, substr($stdTitle{$c} || "", 0, 28), $stdSlides{$c}, $stdQuiz{$c}, $cs, $cq, $es, $eq, $note;
}
my ($tq, $tcq, $teq) = (0, 0, 0);
for my $c (keys %stdQuiz) { $tq += $stdQuiz{$c}; $tcq += $lanQuiz{$c}{challenging} || 0; $teq += $lanQuiz{$c}{elite} || 0; }
print "\nquiz totals: standard=$tq challenging=$tcq elite=$teq\n";
print "challenging-quiz-thin: @thinC\nelite-quiz-thin: @thinE\n";
