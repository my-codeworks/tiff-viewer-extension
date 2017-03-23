"use strict";
const DecoderMemoryLimitInMegabytesDefault = 32;
const ShowDebugOutputDefault = false;

// Saves options to chrome.storage.local.
function save_options() {
    var SaveDecoderMemoryLimitInMegabytes = parseInt(document.getElementById('DecoderMemoryLimitInMegabytes').value);
    var SaveDebugOutput = document.getElementById('ShowDebugOutput').checked;
  
  // Before saving verify if SaveDebugOutput was updated
    chrome.storage.local.get('ShowDebugOutput', function(options) {
        var CheckShowDebugOutput = options.ShowDebugOutput;
        chrome.storage.local.set({
          DecoderMemoryLimitInMegabytes: SaveDecoderMemoryLimitInMegabytes,
          ShowDebugOutput: SaveDebugOutput
        }, function() {
          // Update status to let user know options were saved.
          var status = document.getElementById('status');
          status.textContent = 'Options saved.';
          setTimeout(function() {
            status.textContent = '';
          }, 1050);
        });
        if(CheckShowDebugOutput !== undefined && CheckShowDebugOutput !== SaveDebugOutput) {
            chrome.runtime.reload();
        }
    });
}

// Restores option state using the preferences stored in chrome.storage.
function restore_options() {
    chrome.storage.local.get(['DecoderMemoryLimitInMegabytes', 'ShowDebugOutput'], function(options) {
        if(options.DecoderMemoryLimitInMegabytes !== undefined) {
            document.getElementById('DecoderMemoryLimitInMegabytes').value = options.DecoderMemoryLimitInMegabytes;
        } else {
            document.getElementById('DecoderMemoryLimitInMegabytes').value = DecoderMemoryLimitInMegabytesDefault;
        }
        
        if(options.ShowDebugOutput !== undefined) {
            document.getElementById('ShowDebugOutput').checked = options.ShowDebugOutput;
        } else {
            document.getElementById('ShowDebugOutput').checked = ShowDebugOutputDefault;
        }
    });
}
// Reset select box and checkbox state using the default 
// add-on values.
function reset_options() {
    document.getElementById('DecoderMemoryLimitInMegabytes').value = DecoderMemoryLimitInMegabytesDefault;
    document.getElementById('ShowDebugOutput').checked = ShowDebugOutputDefault;
    
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options restored, need to save.';
    setTimeout(function() {
      status.textContent = '';
    }, 1550);
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('reset').addEventListener('click', reset_options);