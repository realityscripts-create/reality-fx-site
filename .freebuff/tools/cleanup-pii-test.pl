use strict; use warnings;
use JSON::PP;
local $/;
my $file = ".freebuff/tools/system-a-state.json";
open my $f, "<", $file or die $!;
my $j = decode_json(<$f>);
close $f;
my $changed = 0;
for my $e (@{ $j->{enrollments} || [] }) {
    next unless ($e->{id} || "") eq "ENR-0048";
    # Revert the test registration back to a clean PENDING enrollment:
    # token + expiry stay; everything I entered during the test is removed.
    my $reg = $e->{registration} || {};
    for my $k (qw(ageGate personal emailVerifiedAt captchaPassedAt guardian guardianCode
                  guardianCodeAttempts guardianCodeLockedUntil identity selfieDataUrl
                  selfieQuality selfieHash agreements submittedAt tokenUsedAt
                  durationMs firstOpenedAt decision prepGuideSentAt)) {
        delete $reg->{$k};
    }
    delete $e->{studentId};
    delete $e->{studentCode};
    delete $e->{decision};
    delete $e->{progress}{approved};
    delete $e->{progress}{registrationSubmitted};
    $e->{state} = "PENDING";
    $changed = 1;
}
# Remove my "Test" message from the Study Hall room chat.
my $roomsFile = ".freebuff/tools/os-rooms.json";
if (-e $roomsFile) {
    open my $rf, "<", $roomsFile or die $!;
    my $rj = decode_json(<$rf>);
    close $rf;
    my $roomsChanged = 0;
    # The rooms store is a top-level array of room objects.
    for my $room (@{ $rj || [] }) {
        next unless ref($room) eq "HASH" && ($room->{code} || "") eq "HALL5";
        my @keep = grep { ($_->{name} || "") ne "Test" } @{ $room->{chat} || [] };
        if (@keep != @{ $room->{chat} || [] }) { $room->{chat} = \@keep; $roomsChanged = 1; }
    }
    if ($roomsChanged) {
        open my $wf, ">", $roomsFile or die $!;
        print $wf JSON::PP->new->canonical->pretty->encode($rj);
        close $wf;
        print "rooms cleaned\n";
    }
}
if ($changed) {
    open my $wf, ">", $file or die $!;
    print $wf JSON::PP->new->canonical->pretty->encode($j);
    close $wf;
    print "ENR-0048 reverted to clean PENDING\n";
} else {
    print "ENR-0048 not found / nothing to revert\n";
}
