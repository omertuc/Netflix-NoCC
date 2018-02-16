// HTMLCollection doesn't implement iterator in Edge by default.
HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

function noccLog(...args) {
	console.log("[Netflix NoCC Extension Debug Log] -", ...args);
}

function attachSubObserver(targetNode) {
	// Options for the observer (which mutations to observe)
	let config = { attributes: true, subtree: true };

	// Callback function to execute when mutations are observed
	let callback = function(mutationsList, me) {
		for (mutation of mutationsList) {
			if (targetNode in mutation.removedNodes) {

				noccLog("Detected subtitles div deletion")

				me.disconnect();
				waitForSubContainerCreation();
			}
		}

		if (!targetNode.hasChildNodes()) {
			return;
		}

		for (container of targetNode.children)
		{
			if (!container.hasChildNodes()) {
				return;		
			}

			for (child of container.children) {
				child.innerHTML = child.innerHTML.replace(/\[.*\]/g, '') 

				// Attempt to remove non-alphanumeric characters
				let textOnly = child.innerHTML.replace(/[^A-Za-z0-9]/g, '');

				// If it's empty after removing all text, leave it like that since it's just leftover symbols
				if (textOnly == '')
					child.innerHTML = textOnly;
			}    
		}
	};
 	
	// Create an observer instance linked to the callback function
	let observer = new MutationObserver(callback);

	// Start observing the target node for configured mutations
	observer.observe(targetNode, config);

	noccLog("Waiting on", targetNode, " for closed captions to destroy");
}

function waitForSubContainerCreation() {
	let docObserverConfig = {
		childList: true,
		subtree: true
	};

	noccLog("Waiting for subtitles div");

	// Create observer 
	new MutationObserver(function (mutations, me) {
		let subsDivs = document.getElementsByClassName("player-timedtext");

		noccLog("Found all these subs divs:", subsDivs);

		if (subsDivs[0]) {
			noccLog("Found subs container!");

			attachSubObserver(subsDivs[0]);

			// No longer to need to observe the document.
			me.disconnect();
			return;
		}
	}).observe(document, docObserverConfig);
}

waitForSubContainerCreation();