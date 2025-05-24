export const getSeverityColor = (severity: string) => {
  switch (severity?.toLowerCase()) {
    case 'low':
      return 'green';
    case 'medium':
      return 'yellow';
    case 'high':
      return 'orange';
    case 'critical':
      return 'red';
    default:
      return 'gray';
  }
};

export const truncateText = (text: string, charLimit: number) => {
  return text.length > charLimit ? text.slice(0, charLimit) + '...' : text;
};

export const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};