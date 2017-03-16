// Saves options to chrome.storage.sync.
function save_options() {
  var MB = document.getElementById('MB').value;
  
  chrome.storage.local.set({
    MB: MB
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
    chrome.storage.local.get('MB', function(items) {
        var MB;
        if(items.MB !== undefined) {
            MB = items.MB;
        } else {
            MB = "32";
        }
        console.log(MB);
        document.getElementById('MB').value = MB;
    });
}
// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function reset_options() {
  // Use default value makeActive = true and displayBOM = true.
    document.getElementById('MB').value = "32";
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

