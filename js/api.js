/**
 * API integration for workout exercises
 * Uses Wger Workout API
 */

// Cache for exercises (simple version)
window.cachedExercises = null;

/**
 * Fetch exercises from Wger API
 * Follows the assignment steps exactly
 */
function fetchExercisesFromAPI() {
    return fetch("https://wger.de/api/v2/exercise/?language=2&limit=50")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response:', data);
            console.log('Results:', data.results);
            
            // Check if results exist
            if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
                console.warn('No results from API');
                return null;
            }
            
            // Pick ANY 5 exercises (first 5)
            const fiveExercises = data.results.slice(0, 5);
            console.log('Selected 5 exercises:', fiveExercises);
            
            // Cache the exercises (simple version)
            window.cachedExercises = fiveExercises;
            
            return fiveExercises;
        })
        .catch(err => {
            console.error('Error fetching exercises:', err);
            // Return null to indicate failure
            return null;
        });
}
