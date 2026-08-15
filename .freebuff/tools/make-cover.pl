#!/usr/bin/perl
# make-cover.pl — prepend a full-bleed black & gold cover to an md2html build.
# Usage: perl make-cover.pl <body.html> <out.html> "<Doc Title>" "<EYEBROW>" "<Meta line>"
# Reads the md2html-generated body, extracts its <style> and <body> content,
# and composes a single print document: @page :first { margin:0 } for the
# full-bleed cover, the standard @page for the body pages. Printed once with
# headless Edge, page 1 is the cover and the rest flow untouched.
use strict; use warnings;

my ($in, $out, $title, $eyebrow, $meta) = @ARGV;
$title   ||= "Reality FX";
$eyebrow ||= "THE TRADING ACADEMY";
$meta    ||= "15 August 2026";

open my $fh, "<", $in or die "$in: $!";
local $/; my $html = <$fh>; close $fh;

my ($css) = $html =~ m{<style>(.*?)</style>}s;
my ($body) = $html =~ m{<body>(.*)</body>}s;
die "could not parse $in" unless defined $css && defined $body;

my $cover_css = <<'COVER';
/* ---- the cover: full-bleed A4, black & gold, one big crown ---- */
@page :first { margin: 0; }
.cover {
  position: relative; width: 210mm; height: 297mm; overflow: hidden;
  background:
    radial-gradient(ellipse at 50% 42%, rgba(212,175,55,.10) 0%, rgba(212,175,55,.03) 34%, rgba(0,0,0,0) 62%),
    radial-gradient(ellipse at 50% 108%, #0c0a07 0%, #0e0d0a 55%, #090807 100%),
    #0e0d0a;
  display: flex; align-items: center; justify-content: center;
  page-break-after: always; break-after: page;
}
.cover-frame { position: absolute; inset: 11mm; pointer-events: none; }
.cover-frame::before { content: ""; position: absolute; inset: 0; border: 1px solid rgba(212,175,55,.42); }
.cover-frame::after  { content: ""; position: absolute; inset: 2.6mm; border: 1px solid rgba(212,175,55,.16); }
.cover-frame .corner { position: absolute; width: 15mm; height: 15mm; color: rgba(212,175,55,.85); }
.cover-frame .corner svg { width: 100%; height: 100%; display: block; }
.cover-frame .corner.tl { top: 0; left: 0; }
.cover-frame .corner.tr { top: 0; right: 0; transform: scaleX(-1); }
.cover-frame .corner.bl { bottom: 0; left: 0; transform: scaleY(-1); }
.cover-frame .corner.br { bottom: 0; right: 0; transform: scale(-1,-1); }
.cover-inner { position: relative; text-align: center; padding: 0 22mm; }
.cover-brand { font-family: Arial, Helvetica, sans-serif; font-size: 8.5pt; letter-spacing: 7px; color: var(--gold); text-transform: uppercase; margin-bottom: 13mm; }
.cover-crown { width: 118mm; margin: 0 auto 8mm; line-height: 0; }
.cover-crown img { width: 100%; height: auto; display: block; }
/* no mask — the crop already carries dark margins, and the radial mask used to
   fade exactly the top of the peak spheres (the "cut-off crown" bug) */
.cover-rule { position: relative; width: 62mm; height: 1px; margin: 9mm auto; background: linear-gradient(90deg, rgba(212,175,55,0), rgba(212,175,55,.75), rgba(212,175,55,0)); }
.cover-rule .cover-orn { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); background: #0d0b08; padding: 0 5px; color: var(--gold); font-size: 8.5pt; line-height: 1; }
.cover-title { font-family: Georgia, serif; font-size: 25pt; font-weight: 700; color: var(--ink); margin: 0; letter-spacing: .3px; line-height: 1.22; }
.cover-sub { font-family: Arial, Helvetica, sans-serif; font-size: 7.5pt; letter-spacing: 3px; color: var(--gold); text-transform: uppercase; margin-top: 7mm; }
.cover-tagline { font-family: Georgia, serif; font-style: italic; font-size: 11pt; color: var(--gold-soft); margin: 8mm 0 0; }
.cover-meta { font-family: Arial, Helvetica, sans-serif; font-size: 8pt; letter-spacing: 2px; color: var(--mut); margin-top: 11mm; }
.cover-foot { position: absolute; left: 0; right: 0; bottom: 13mm; text-align: center; font-family: Arial, Helvetica, sans-serif; font-size: 7.5pt; letter-spacing: 3px; color: var(--mut); }
.cover-foot .c { color: var(--gold); }
COVER

my $corner_svg = <<'CORNER';
<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M10 90 L10 26 Q10 10 26 10 L90 10" stroke="currentColor" stroke-width="2.6" fill="none"/>
  <path d="M10 58 Q10 44 24 44 L90 44" stroke="currentColor" stroke-width="1.1" fill="none" opacity="0.55"/>
  <rect x="72" y="-2" width="15" height="15" transform="rotate(45 79.5 5.5)" stroke="currentColor" stroke-width="1.6" fill="none"/>
</svg>
CORNER

# The crown is the founder's own render — cropped from the approved concept
# cover and embedded as a data URI so the print document is fully self-
# contained (no external asset, works from any host).
use MIME::Base64;
open my $cfh, '<:raw', 'crown-src.png' or die "crown-src.png: $!";
local $/; my $crown_png = <$cfh>; close $cfh;
my $crown_img = '<img src="data:image/png;base64,' . MIME::Base64::encode_base64($crown_png, '') . '" alt=""/>';

my $cover_html = <<"COVERHTML";
<div class="cover">
  <div class="cover-frame">
    <span class="corner tl">$corner_svg</span>
    <span class="corner tr">$corner_svg</span>
    <span class="corner bl">$corner_svg</span>
    <span class="corner br">$corner_svg</span>
  </div>
  <div class="cover-inner">
    <div class="cover-brand">Reality FX</div>
    <div class="cover-crown">$crown_img</div>
    <h1 class="cover-title">$title</h1>
    <div class="cover-rule"><span class="cover-orn">&#10022;</span></div>
    <div class="cover-sub">$eyebrow</div>
    <p class="cover-tagline">&ldquo;Every lesson is a trade. Every trade is a lesson.&rdquo;</p>
    <div class="cover-meta">$meta</div>
  </div>
  <div class="cover-foot"><span class="c">&#9819;</span> &nbsp;REALITY FX &nbsp;·&nbsp; THE TRADING ACADEMY &nbsp;·&nbsp; EST. 2020</div>
</div>
COVERHTML

my $full = <<"HTML";
<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<title>$title</title>
<style>
$css
$cover_css
</style></head>
<body>
$cover_html
$body
</body></html>
HTML

open my $oh, ">", $out or die "$out: $!";
print $oh $full;
close $oh;
print "wrote $out (cover + " . length($body) . " bytes of body)\n";
