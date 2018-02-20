// HTMLCollection doesn't implement iterator in Edge by default.
HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

noccLog = (...args) => {
	console.log("[Netflix NoCC Extension Debug Log] -", ...args);
}

fixSubs = (tt) => {
	let subs = tt;

	if (!subs.hasChildNodes()) {
		return;
	}

	for (container of subs.children)
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
}

// Options for the observer (which mutations to observe)
let config = { attributes: true, childList: true, subtree: true};

// Callback function to execute when mutations are observed
let callback = (mutationsList, me) => {
	for (mut of mutationsList) {
		if (mut.target.className == "player-timedtext") {
			fixSubs(mut.target);
		}
	}
};
	
// Create an observer instance linked to the callback function
let observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(document, config);

noccLog("Waiting on", document, " for closed captions to destroy");