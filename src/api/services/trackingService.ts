import apiClient from "../apiClient";

interface TrackingEventsParams {
	userId?: string | number;
	eventType?: string;
	eventName?: string;
	startTime?: string;
	endTime?: string;
	page?: number;
	pageSize?: number;
}

interface TrackingEvent {
	id: number;
	userId: string | number | null;
	eventType: string;
	eventName: string;
	eventData: Record<string, any>;
	userAgent: string;
	ip: string;
	deviceType: string | null;
	platform: string | null;
	timestamp: string;
	appVersion: string | null;
	pageUrl: string | null;
	sessionId: string | null;
	user: any | null;
}

interface PaginationData {
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

interface TrackingEventsResponse {
	data: TrackingEvent[];
	pagination: PaginationData;
}

export const trackingService = {
	getEvents: (params: TrackingEventsParams) => {
		return apiClient.get<TrackingEventsResponse>({ url: "/tracking/events", params });
	},
};
