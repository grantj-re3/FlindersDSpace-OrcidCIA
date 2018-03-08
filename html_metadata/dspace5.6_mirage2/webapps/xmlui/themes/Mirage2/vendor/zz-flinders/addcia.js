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

  // Field format: "CIA: Surname, Givenname ORCID:0000-0000-0000-0000"
  var delim = /^ *cia: *| *orcid: */i;
  for (var i=0; i<elems.length; i++) {
    var metadata = elems[i].getAttribute("content");
    if (!metadata) { continue; }	// Not found
    var a = metadata.split(delim);
    if(a.length == 3 && !a[0] && a[1] && a[2]) { // Formatting is ok
      var cia_json = JSON.stringify( {"name": a[1], "orcid": a[2]} ); // Escape special JSON chars
      zzDoCustAddCiaNode(cia_json);
      return;	// Stop after processing the first one which matches our format
    }
  }
};

/*
 * Is this a target page (where we will add CIA info)?
 */
function zzDoCustIsTargetPage() {
  // FIXME: Is there a better way to verify if this is a simple-item-view page?
  return document.getElementsByClassName("simple-item-view-show-full")[0];
}

/*
 * Based on the JSON string argument, create a DIV containing
 * CIA info and add it to the DOM. JSON format example:
 *   '{ "name":"Surname, Givenname", "orcid":"0000-0000-0000-0000" }'
 */
function zzDoCustAddCiaNode(cia_json) {
  // Create a wrapper (div) with 3 children: heading (h5), name (div) &
  // orcid (div); then insert the wrapper into the DOM.
  var elem = document.getElementsByClassName("simple-item-view-show-full")[0];
  if(!elem) { return; }	// This is not a simple-item-view page!

  var obj = JSON.parse(cia_json);
  var wrap = document.createElement("div");
  // Use same styles as simple-item-view-authors
  wrap.setAttribute("class", "simple-item-view-authors item-page-field-wrapper table");

  var child = document.createElement("h5");
  var t = document.createTextNode("Chief Investigator A");
  child.appendChild(t);
  wrap.appendChild(child);

  child = document.createElement("div");
  t = document.createTextNode(obj.name);
  child.appendChild(t);
  wrap.appendChild(child);

  child = document.createElement("div");
  t = document.createTextNode("ORCiD:" + obj.orcid);
  child.appendChild(t);
  wrap.appendChild(child);

  elem.parentNode.insertBefore(wrap, elem);
}

