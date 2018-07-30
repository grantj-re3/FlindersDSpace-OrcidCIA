/*
 * Copyright (c) 2017, Flinders University, South Australia. All rights reserved.
 * Contributors: Library, Corporate Services, Flinders University.
 * See the accompanying LICENSE file (or http://opensource.org/licenses/BSD-3-Clause).
 *
 * PURPOSE:
 * To add custom info regarding CIA (Chief Investigator A) including ORCID.
 */


/*
 * Get CIA info from the DSpace metadata field (in the html-head section)
 */
window.onload = function () {
  if(!zzDoCustIsTargetPage()) { return; } // We are not on a target page!

  // - DSpace UI metadata field: dc.contributor.other
  // - Corresponding HTML field: <meta name="DC.contributor" content="..." />
  var field = "DC.contributor";		// HTML path: /html/head/meta[@name]
  var elems = document.querySelectorAll("meta[name='" + field + "']");
  if (elems.length == 0) { return; }	// None found

  // Field format: "Surname, Givenname : 0000-0000-0000-000X"
  var re = /^ *([^:]+?) *: *(\d{4}-\d{4}-\d{4}-\d{3}[\dX]) *$/
  var cias = [];			// Array of (JSON) strings

  for (var i=0; i<elems.length; i++) {
    var metadata = elems[i].getAttribute("content");
    if (!metadata) { continue; }	// Not found
    var a = metadata.match(re)
    if(a && a.length == 3) { // Formatting is ok
      cias.push( JSON.stringify( {"name": a[1], "orcid": a[2]} ) ); // Escape special JSON chars
    }
  }
  if (cias.length > 0) { zzDoCustAddCiaNode(cias); }
};

/*
 * Is this a target page (where we will add CIA info)?
 */
function zzDoCustIsTargetPage() {
  // FIXME: Is there a better way to verify if this is a simple-item-view page?
  return document.getElementsByClassName("simple-item-view-show-full")[0];
}

/*
 * Based on the array of CIA-strings, create a DIV containing
 * CIA info and add it to the DOM. Each array element has the
 * following JSON format:
 *   '{ "name":"Surname, Givenname", "orcid":"0000-0000-0000-000X" }'
 * We assume the array is not empty & JSON-string & content is valid.
 */
function zzDoCustAddCiaNode(cias) {
  // Create a wrapper (div) with the following children:
  // - heading (h5)
  // - name (div) & orcid (div) for each CIA
  // then insert the wrapper into the DOM.
  var elem = document.getElementsByClassName("simple-item-view-show-full")[0];
  if(!elem) { return; }	// This is not a simple-item-view page!

  var wrap = document.createElement("div");
  // Use same styles as simple-item-view-authors
  wrap.setAttribute("class", "simple-item-view-authors item-page-field-wrapper table");

  var child = document.createElement("h5");
  var t = document.createTextNode("Chief Investigator");
  child.appendChild(t);
  wrap.appendChild(child);

  for(var i in cias) {
    var obj = JSON.parse(cias[i]);

    // FIXME: Comment out 2 lines below to remove gap before each Chief Investigator
    child = document.createElement("p");
    wrap.appendChild(child);

    // Name-DIV
    child = document.createElement("div");
    t = document.createTextNode(obj.name);
    child.appendChild(t);
    wrap.appendChild(child);

    // ORCID-DIV contains text & hyperlink
    child = document.createElement("div");
    t = document.createTextNode("ORCiD:");
    child.appendChild(t);

    var link = document.createElement("a");
    link.href = "https://orcid.org/" + obj.orcid;
    link.target = "_blank";
    t = document.createTextNode(obj.orcid);
    link.appendChild(t);
    child.appendChild(link);
    wrap.appendChild(child);
  }
  elem.parentNode.insertBefore(wrap, elem);
}

