"use strict";
// Defaults
var DecoderMemoryLimitInMegabytes = 32;
var DebugOutput = false;

// Saves options to chrome.storage.sync.
function save_options() {
  var SaveDecoderMemoryLimitInMegabytes = parseInt(document.getElementById('DecoderMemoryLimitInMegabytes').value);
  var SaveDebugOutput = document.getElementById('DebugOutput').checked;
  
  chrome.storage.local.set({
    DecoderMemoryLimitInMegabytes: SaveDecoderMemoryLimitInMegabytes,
    DebugOutput: SaveDebugOutput
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1050);
  });
}

// Restores option state using the preferences stored in chrome.storage.
function restore_options() {
    chrome.storage.local.get(['DecoderMemoryLimitInMegabytes', 'DebugOutput'], function(items) {
    console.log(items.DecoderMemoryLimitInMegabytes);
        if(items.DecoderMemoryLimitInMegabytes !== undefined) {
            document.getElementById('DecoderMemoryLimitInMegabytes').value = items.DecoderMemoryLimitInMegabytes;
        } else {
            document.getElementById('DecoderMemoryLimitInMegabytes').value = DecoderMemoryLimitInMegabytes;
        }
        
        if(items.DebugOutput !== undefined) {
            document.getElementById('DebugOutput').checked = items.DebugOutput;
        } else {
            document.getElementById('DebugOutput').checked = DebugOutput;
        }
    });
}
// Reset select box and checkbox state using the default 
// add-on values.
function reset_options() {
    document.getElementById('DecoderMemoryLimitInMegabytes').value = DecoderMemoryLimitInMegabytes;
    document.getElementById('DebugOutput').checked = DebugOutput;
    
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options reset, need to save.';
    setTimeout(function() {
      status.textContent = '';
    }, 1550);
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('reset').addEventListener('click', reset_options);


// Saves options to chrome.storage.sync.

