export const getGreeting = (): string => {
  const now = new Date();
  const hour = now.getHours(); // Gets the hour from 0 to 23

  if (hour >= 5 && hour < 12) {
    return "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good Afternoon";
  } else if (hour >= 17 && hour < 24) {
    return "Good Evening";
  } else {
    // Covers hours from 0 (midnight) to 4 AM
    return "Good Night";
  }
};
