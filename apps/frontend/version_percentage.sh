#!/bin/sh -e

if ! hash awk >/dev/null; then
    echo "awk is not installed" >&2
fi

if ! hash curl >/dev/null; then
    echo "curl is not installed" >&2
fi

print_usage() {
    cat<<EOF >&2
$(basename "$0") ADDRESS [SAMPLE_COUNT]

ADDRESS        Location of the frontend service.
SAMPLE_COUNT   Number of version samples to collect from the frontend service.
EOF
}

fetch_samples() {
    local url="$1/version"
    local sample_count=1000

    if [ "$2" ]; then
        sample_count=$2
    fi

    echo "Collecting $sample_count samples from $url ..." >&2
    for i in $(seq 1 "$sample_count"); do
        curl -s "$url"
    done
}

report_percentages() {
    awk '
{
    for (i=1; i <= NF; i++) {
        total++
        a[$i]++
    }
} END {
    for (c in a) {
        print "v" c ": " (a[c] * 100 / total) "%"
    }
}' FS=""
}

main() {
    local address=$1
    local sample_count=$2
    
    if [ ! "$address" ]; then
        print_usage
        return 1
    fi

    fetch_samples "$address" "$sample_count" | report_percentages
}

main "$@"
