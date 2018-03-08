FlindersDSpace-OrcidCIA
=======================

## Summary

This repo shows a workaround to display the ORCID of the Chief Investigator
A (CIA) in DSpace.


## Background

The Australian NHMRC have specified the following in the document *National
Health and Medical Research Council, Open Access Policy, 15 January 2018,
Appendix 1, item 10*:

> "The [institutional repository] publication metadata must also include
> the ORCID identifier of the author submitting the metadata."

The NHMRC have also confirmed on the CAIRSS list that they:

> "... require the ORCID of the CIA to be displayed"

However, despite the fact that DSpace 5 and 6 include ORCID integration,
that integration uses ORCID API v1 which is due to be decommissioned
(originally in "late 2017", but now "Public API from March 1, 2018" and
"Member API within 2018").

So, is there a way to integrate the ORCID of the Chief Investigator A
into DSpace?

Desirable features:
1. Easy to setup.
2. Easy to maintain.
3. Easy to decommission later (eg. when DSpace supports ORCID API v2).

References:
- https://www.nhmrc.gov.au/grants-funding/policy/nhmrc-open-access-policy
- https://www.nhmrc.gov.au/_files_nhmrc/file/research/nhmrc_open_access_policy_15_january_2018_v2.pdf
- https://groups.google.com/forum/#!topic/dspace-tech/HO_4e-WYjjo
- https://jira.duraspace.org/browse/DS-3447


## Solution 1 - Use javascript plus DSpace metadata

See folder *html_metadata*.

Environment:
- DSpace 5
- XMLUI Mirage 2

The solution:
- Add name and ORCID of the CIA into a DSpace metadata field (eg.
  "dc.contributor.other" or other field).
- This will result in the content appearing in a corresponding (but
  not necessarily identically named) HTML META-tag on the Simple
  Item Record page (eg. "DC.contributor").
- Add a javascript program which does the following on the Simple
  Item Record page:
  * extracts the content of the META-tag (ie. researcher name and ORCID)
  * adds the content to a DIV element
  * adds the DIV element to the page

Evaluation of the solution:
1. Easy to setup.
2. Easy to maintain.
3. To decommission, it would be trivial to disable the javascript,
   but what about all the metadata (eg. in "dc.contributor.other")
   which we may wish to remove?
   If the impacted records are isolated to a small number of
   collections and/or the chosen metadata field contains only CIA
   info and nothing else, then perhaps it would be fairly
   straightforward to remove the fields from all affected records
   via the DSpace Batch Metadata Editing tool.


## Solution 2 - Use javascript plus a custom database

Not implemented here (yet).

The solution:

Similar to the above, except instead of extracting CIA info from
the HTML META-tag, an AJAX call is made back to a custom database
on the DSpace server (with the item handle as a parameter). If
there is a match for the item handle in the database, the name
and ORCID of the CIA associated with the item is returned and
then displayed on the page.

Evaluation of the solution:
1. More complicated to setup.
   * Javascript component should be straightforward (similar to
     above).
   * On the server-side you would need to configure a database;
     perhaps SQLite would be trival.
   * On the server side you would need to write a PHP or similar
     script invoked from your web server to accept the AJAX call
     with the item-handle parameter then return the result in
     say JSON format; small effort needed.)
2. More complicated to maintain.
   * Perhaps DSpace users maintain a spreadsheet (eg. with
     columns cia-name, cia-orcid, list of item-handles).
   * Write a script to load the spreadsheet into 2 tables of
     the database (eg. "details" table for name and orcid;
     "handles" table for handle; where there are potentially
     many handles records for one details record).
3. Easy to decommission later (ie. just disable the javascript).


## Solution 3 - Modify the DSpace Java source code & add custom database table

I am not a Java developer, so this is not a likely option for me.
In fact perhaps a Java developer could contribute code to implement
the ORCID API v2 instead?

