#!/usr/bin/perl
# Minimal static file server for the PDF build dir (core modules only).
# Usage: perl pdf-serve.pl <root-dir> <port>
use strict; use warnings;
use HTTP::Daemon; use HTTP::Status; use File::Spec;

my ($root, $port) = @ARGV;
$root = File::Spec->rel2abs($root || ".");
$port ||= 49300;
my $d = HTTP::Daemon->new(LocalAddr => "127.0.0.1", LocalPort => $port, ReuseAddr => 1) or die "bind: $!";
print "serving $root on http://127.0.0.1:$port/\n";
while (my $c = $d->accept) {
    while (my $r = $c->get_request) {
        my $path = $r->url->path;
        $path = "/index.html" if $path eq "/";
        my $full = File::Spec->catfile($root, $path =~ s{^/}{}r);
        if (-f $full && -r $full) {
            open my $fh, "<", $full or next; binmode $fh; local $/; my $data = <$fh>; close $fh;
            my ($ext) = $path =~ /\.([a-z0-9]+)$/i;
            my %ct = (html => "text/html; charset=utf-8", htm => "text/html; charset=utf-8", css => "text/css", pdf => "application/pdf", png => "image/png", jpg => "image/jpeg", svg => "image/svg+xml");
            $c->send_file_response($full);
        } else {
            $c->send_error(RC_NOT_FOUND);
        }
    }
    $c->close;
}
