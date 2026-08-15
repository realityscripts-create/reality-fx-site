#!/usr/bin/env perl
# Scaffold a tier deck skeleton for a chapter. Usage:
#   perl scaffold-tier-deck.pl <chapterId> <lane>   (lane: challenging | elite)
# Writes .freebuff/tools/ch<N>-<lane>-block.js — the full 27-slide skeleton
# (15 content + pause + 10 quiz nulls + close) with placeholders to fill.
use strict; use warnings;

my ($ch, $lane) = @ARGV;
die "usage: perl scaffold-tier-deck.pl <ch> <lane>\n" unless defined $ch && defined $lane && $lane =~ /^(challenging|elite)$/;
die "chapter id must be a number\n" unless $ch =~ /^\d+$/;

my $laneName = ucfirst($lane);

my @deck;
for my $n (1..15) {
  my $title = $n == 1
    ? ($lane eq "challenging" ? "You Are the Analyst" : "The Market Is a Probability Machine")
    : "Slide $n — REPLACE";
  push @deck, <<"BLOCK";
        {
          eyebrow: "$laneName · Movement name",
          title: "$title",
          lead: "REPLACE — the hook, one or two sentences.",
          body: [
            "REPLACE — first paragraph.",
            "REPLACE — second paragraph."
          ],
          bullets: [
            "REPLACE — gold bullet",
            "REPLACE — gold bullet",
            "REPLACE — gold bullet"
          ],
          callout: "REPLACE — a single dramatic line (sparingly).",
          insight: "REPLACE — the one line the student will repeat."
        },
BLOCK
}

my $pause = <<"BLOCK";
        {
          kind: "pause",
          eyebrow: "$laneName · Breathe",
          title: "Reset Before the Test",
          lead: "REPLACE — one breath before the gate.",
          body: [
            "REPLACE — what the ten questions will demand."
          ]
        },
BLOCK

my $close = <<"BLOCK";
        {
          kind: "close",
          eyebrow: "$laneName chapter complete",
          title: "REPLACE — the capstone title",
          body: [
            "REPLACE — recap of the lane's movements.",
            "REPLACE — the lane's difference, then: Finish the test, and the Summit continues in Chapter N's $laneName lane."
          ]
        }
BLOCK

my $quiz = join "", map {
  my $n = $_;
  <<"BLOCK"
        { q: "REPLACE Q$n — question text",
          options: ["REPLACE option A", "REPLACE option B", "REPLACE option C"], answer: 0,
          explain: "REPLACE — direct answer, then 'The deeper layer: …' for the $laneName lane." },
BLOCK
} (1..10);

my $nulls = join "", ("        null,\n" x 10);

my $out = <<"BLOCK";
    $lane: {
      slides: 27,
      quizSlides: [17,18,19,20,21,22,23,24,25,26],
      quiz: [
$quiz      ],
      native: [
@{deck}$pause$nulls$close
      ]
    }
BLOCK

open my $f, ">", ".freebuff/tools/ch$ch-$lane-block.js" or die $!;
print $f $out;
print "scaffolded ch$ch $lane -> .freebuff/tools/ch$ch-$lane-block.js\n";
print "fill the 15 slides, 10 questions, and the close, then splice.\n";
