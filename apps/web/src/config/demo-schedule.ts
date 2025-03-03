/**
 * Configuration file for demo schedule
 * 
 * This file contains the configuration for available demo time slots.
 * Update this file to change the available weeks and time slots for demos.
 */

export interface TimeSlot {
  id: string;
  day: string;
  time: string;
  duration: string;
}

export interface WeekOption {
  id: string;
  label: string;
  dateRange: string;
  slots: TimeSlot[];
}

/**
 * Available weeks for scheduling with their available time slots
 * Each week contains its own array of available time slots
 */
export const availableWeeks: WeekOption[] = [
  {
    id: "current",
    label: "This week",
    dateRange: "Mar 4 - Mar 8",
    slots: [
      {
        id: "tue-10:00",
        day: "Tuesday",
        time: "10:00 AM",
        duration: "45 minutes"
      },
      {
        id: "wed-11:00",
        day: "Wednesday",
        time: "11:00 AM",
        duration: "45 minutes"
      },
      {
        id: "thu-15:00",
        day: "Thursday",
        time: "3:00 PM",
        duration: "45 minutes"
      }
    ]
  },
  {
    id: "next",
    label: "Next week",
    dateRange: "Mar 11 - Mar 15",
    slots: [
      {
        id: "tue-10:00",
        day: "Tuesday",
        time: "10:00 AM",
        duration: "45 minutes"
      },
      {
        id: "tue-14:00",
        day: "Tuesday",
        time: "2:00 PM",
        duration: "45 minutes"
      },
      {
        id: "wed-11:00",
        day: "Wednesday",
        time: "11:00 AM",
        duration: "45 minutes"
      },
      {
        id: "thu-09:00",
        day: "Thursday",
        time: "9:00 AM",
        duration: "45 minutes"
      },
      {
        id: "thu-15:00",
        day: "Thursday",
        time: "3:00 PM",
        duration: "45 minutes"
      },
      {
        id: "fri-13:00",
        day: "Friday",
        time: "1:00 PM",
        duration: "45 minutes"
      }
    ]
  },
  {
    id: "after",
    label: "Week after",
    dateRange: "Mar 24 - Mar 28",
    slots: [
      {
        id: "wed-11:00",
        day: "Wednesday",
        time: "11:00 AM",
        duration: "45 minutes"
      },
      {
        id: "fri-14:00",
        day: "Friday",
        time: "14:00 PM",
        duration: "30 minutes"
      }
    ]
  }
];

/**
 * Get available time slots for a specific week
 * @param weekId The ID of the week to get time slots for
 * @returns Array of time slot objects available for the specified week
 */
export const getTimeSlotsForWeek = (weekId: string): TimeSlot[] => {
  // Find the selected week
  const selectedWeek = availableWeeks.find(week => week.id === weekId);
  
  if (!selectedWeek) {
    return [];
  }
  
  // Return the slots for this week
  return selectedWeek.slots;
};

// Create a named export object
const demoSchedule = {
  availableWeeks,
  getTimeSlotsForWeek
};

// Export the named object as default
export default demoSchedule;