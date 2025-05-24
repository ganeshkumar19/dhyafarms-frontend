export function formatRelativeTime(date: string): string {
    const diffMs = Date.now() - new Date(date).getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  
    if (diffMinutes < 1) return "Updated less than a minute ago";
    if (diffMinutes < 60) return `Updated ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `Updated ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `Updated ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
  
  export function getDaysAgo(date: string): string {
    const now = new Date();
    const past = new Date(date);
  
    // Reset the time of both dates to ignore the time part
    now.setHours(0, 0, 0, 0);
    past.setHours(0, 0, 0, 0);
  
    const diffDays = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60 * 24));
  
    // If the dates are the same, return 'Last fed today'
    if (diffDays === 0) {
      return 'Last fed today';
    }
  
    return `Last fed ${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }