#!/bin/bash
DBHOST=156.17.43.89/jellypizzahack
APPHOST=localhost:49152

echo "# Drop DB"
mongo $DBHOST --eval "db.dropDatabase()"
echo ""

echo "# Test GET /"
curl $APPHOST
echo ""
echo ""

echo "# Test POST /team"
curl \
    --header "Content-Type: application/json" \
    -X POST -d @team.json \
    http://$APPHOST/team
echo ""
echo ""

echo "# Re-POST /team"
curl \
    --header "Content-Type: application/json" \
    -X POST -d @team.json \
    http://$APPHOST/team
echo ""; echo ""

echo "# Second Re-POST /team"
curl \
    --header "Content-Type: application/json" \
    -X POST -d @team.json \
    http://$APPHOST/team
