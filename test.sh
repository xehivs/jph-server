#!/bin/bash
DBHOST=156.17.43.89/jellypizzahack
APPHOST=localhost:49152

echo "# Drop DB"
mongo $DBHOST --eval "db.dropDatabase()"
echo ""

echo "# Test GET /"
curl $APPHOST
echo ""

echo "# Test POST /team"
curl -i \
    -H "Accept: application/json" \
    -X POST -d "value":"30","type":"Tip 3","targetModule":"Target 3","configurationGroup":null,"name":"Configuration Deneme 3","description":null,"identity":"Configuration Deneme 3","version":0,"systemId":3,"active":true \
    http://$APPHOST/team
