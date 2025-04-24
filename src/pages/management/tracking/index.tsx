import { trackingService } from "@/api/services/trackingService";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Form, Input, Select, Space, Spin, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const { RangePicker } = DatePicker;
const { Option } = Select;

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

const TrackingEventsList = () => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [events, setEvents] = useState<TrackingEvent[]>([]);
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 10,
		total: 0,
	});

	// 使用ref来存储最新的pagination状态，避免useCallback依赖pagination
	const paginationRef = useRef(pagination);
	useEffect(() => {
		paginationRef.current = pagination;
	}, [pagination]);

	const eventTypes = [
		{ value: "click", label: t("tracking.eventTypes.click") },
		// { value: "view", label: t("tracking.eventTypes.view") },
		{ value: "load", label: t("tracking.eventTypes.load") },
		// { value: "submit", label: t("tracking.eventTypes.submit") },
	];

	const columns: ColumnsType<TrackingEvent> = [
		{
			title: t("tracking.fields.id"),
			dataIndex: "id",
			key: "id",
			width: 80,
		},
		{
			title: t("tracking.fields.userId"),
			dataIndex: "userId",
			key: "userId",
			width: 120,
			render: (userId) => userId || "-",
		},
		{
			title: t("tracking.fields.eventType"),
			dataIndex: "eventType",
			key: "eventType",
			width: 120,
		},
		{
			title: t("tracking.fields.eventName"),
			dataIndex: "eventName",
			key: "eventName",
			width: 200,
			ellipsis: true,
		},
		{
			title: t("tracking.fields.ip"),
			dataIndex: "ip",
			key: "ip",
			width: 120,
		},
		{
			title: t("tracking.fields.deviceType"),
			dataIndex: "deviceType",
			key: "deviceType",
			width: 120,
			render: (deviceType) => deviceType || "-",
		},
		{
			title: t("tracking.fields.platform"),
			dataIndex: "platform",
			key: "platform",
			width: 120,
			render: (platform) => platform || "-",
		},
		{
			title: t("tracking.fields.timestamp"),
			dataIndex: "timestamp",
			key: "timestamp",
			width: 180,
			render: (timestamp) => dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss"),
		},
		{
			title: t("tracking.fields.userAgent"),
			dataIndex: "userAgent",
			key: "userAgent",
			width: 300,
			ellipsis: true,
		},
	];

	const fetchEvents = useCallback(
		async (params = {}) => {
			setLoading(true);
			try {
				const values = form.getFieldsValue();
				const [startTime, endTime] = values.timeRange || [null, null];

				const currentPagination = paginationRef.current;
				const queryParams = {
					page: currentPagination.current,
					pageSize: currentPagination.pageSize,
					userId: values.userId,
					eventType: values.eventType,
					eventName: values.eventName,
					startTime: startTime ? startTime.toISOString() : undefined,
					endTime: endTime ? endTime.toISOString() : undefined,
					...params,
				};

				const response = await trackingService.getEvents(queryParams);
				setEvents(response.data);
				setPagination({
					...currentPagination,
					total: response.pagination.total,
					current: response.pagination.page,
					pageSize: response.pagination.pageSize,
				});
			} catch (error) {
				console.error("Error fetching tracking events:", error);
			} finally {
				setLoading(false);
			}
		},
		[form], // 移除pagination依赖
	);

	useEffect(() => {
		fetchEvents();
	}, [fetchEvents]);

	const handleTableChange = (newPagination: TablePaginationConfig) => {
		setPagination({
			...pagination,
			current: newPagination.current || 1,
			pageSize: newPagination.pageSize || 10,
		});
		fetchEvents({
			page: newPagination.current,
			pageSize: newPagination.pageSize,
		});
	};

	const handleSearch = () => {
		setPagination({
			...pagination,
			current: 1,
		});
		fetchEvents({ page: 1 });
	};

	const handleReset = () => {
		form.resetFields();
		setPagination({
			...pagination,
			current: 1,
		});
		fetchEvents({ page: 1 });
	};

	return (
		<div className="p-6">
			<Card className="mb-6">
				<Form form={form} layout="inline" onFinish={handleSearch} className="flex flex-wrap gap-4">
					<Form.Item name="userId" label={t("tracking.fields.userId")}>
						<Input placeholder={t("tracking.placeholders.userId")} />
					</Form.Item>
					<Form.Item name="eventType" label={t("tracking.fields.eventType")}>
						<Select placeholder={t("tracking.placeholders.eventType")} allowClear style={{ width: 150 }}>
							{eventTypes.map((type) => (
								<Option key={type.value} value={type.value}>
									{type.label}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name="eventName" label={t("tracking.fields.eventName")}>
						<Input placeholder={t("tracking.placeholders.eventName")} />
					</Form.Item>
					<Form.Item name="timeRange" label={t("tracking.fields.timeRange")}>
						<RangePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: 380 }} />
					</Form.Item>
					<Form.Item className="flex-grow flex justify-end">
						<Space>
							<Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
								{t("search")}
							</Button>
							<Button onClick={handleReset} icon={<ReloadOutlined />}>
								{t("reset")}
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</Card>

			<Card>
				<Spin spinning={loading}>
					<Table
						columns={columns}
						dataSource={events}
						rowKey="id"
						pagination={{
							...pagination,
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: (total: number) => t("pagination.totalItems", { total }),
						}}
						onChange={handleTableChange}
						scroll={{ x: 1500 }}
					/>
				</Spin>
			</Card>
		</div>
	);
};

export default TrackingEventsList;
