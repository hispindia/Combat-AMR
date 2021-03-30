SELECT eventdatavalues -> 'lIkk661BLpG' ->> 'value' as amrid
FROM programstageinstance e
INNER JOIN programinstance pi ON e.programinstanceid = pi.programinstanceid
INNER JOIN program pr ON pi.programid = pr.programid
INNER JOIN organisationunit o ON e.organisationunitid = o.organisationunitid
WHERE o.path LIKE '%${orgunit}%' and eventdatavalues -> 'lIkk661BLpG' is not null
ORDER BY eventdatavalues -> 'lIkk661BLpG' ->> 'value';