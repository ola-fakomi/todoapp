export const getPaginationNumbers = (options: {
	maxVisible?: number;
	alwaysShowFirst?: boolean;
	alwaysShowLast?: boolean;
	surroundingPages?: number;
	totalPages: number;
	currentPage: number;
}) => {
	const {
		maxVisible = 7,
		alwaysShowFirst = true,
		alwaysShowLast = true,
		surroundingPages = 2,
		totalPages,
		currentPage,
	} = options;

	if (totalPages <= maxVisible) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}

	const pagesToShow = [];

	if (alwaysShowFirst) {
		pagesToShow.push(1);
	}

	let start = Math.max(alwaysShowFirst ? 2 : 1, currentPage - surroundingPages);
	let end = Math.min(
		alwaysShowLast ? totalPages - 1 : totalPages,
		currentPage + surroundingPages
	);

	// Adjust if we're too close to the edges
	const availableSlots =
		maxVisible - (alwaysShowFirst ? 1 : 0) - (alwaysShowLast ? 1 : 0);

	if (end - start + 1 > availableSlots) {
		if (currentPage - start < end - currentPage) {
			// Closer to start, extend end
			end = start + availableSlots - 1;
		} else {
			// Closer to end, extend start
			start = end - availableSlots + 1;
		}
	}

	// Add ellipsis marker if there's a gap after first page
	if (alwaysShowFirst && start > 2) {
		pagesToShow.push('...');
	}

	// Add surrounding pages
	for (let i = start; i <= end; i++) {
		if (i > 0 && i <= totalPages) {
			pagesToShow.push(i);
		}
	}

	// Add ellipsis marker if there's a gap before last page
	if (alwaysShowLast && end < totalPages - 1) {
		pagesToShow.push('...');
	}

	// Always add last page
	if (alwaysShowLast && totalPages > 1) {
		pagesToShow.push(totalPages);
	}

	return pagesToShow.filter((page, index, arr) => {
		// Remove duplicates while preserving order
		return arr.indexOf(page) === index;
	});
};
