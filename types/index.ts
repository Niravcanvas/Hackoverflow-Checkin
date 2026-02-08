/**
 * Type Definitions for Hackoverflow Check-in
 * 
 * @module types
 */

/** Database participant with all hackathon details */
export interface DBParticipant {
  _id?: string;
  participantId: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  teamName?: string;
  institute?: string;
  labAllotted?: string;
  wifiCredentials?: {
    ssid?: string;
    password?: string;
  };
  collegeCheckIn?: {
    status: boolean;
    time?: Date;
  };
  labCheckIn?: {
    status: boolean;
    time?: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

/** Check-in response for API */
export interface CheckInResponse {
  success: boolean;
  message: string;
  participant?: DBParticipant;
}