export const getLatestCommitHash = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.github.com/repos/inttter/notetxt/commits?per_page=1');
      const commits = await response.json();
      if (commits && commits.length > 0) {
        // Get first 7 letters/numbers of hash
        return commits[0].sha.substring(0, 7);
      } else {
        throw new Error('No commits found. This is most likely due to being rate-limited by the GitHub API. Try again in a few minutes.');
      }
    } catch (error) {
      console.error('Failed to fetch latest commit hash:', error);
      return 'unknown';
    }
  };