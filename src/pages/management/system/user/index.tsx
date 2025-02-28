import userService from "@/api/services/userService";
import { IconButton, Iconify } from "@/components/icon";
import { usePathname, useRouter } from "@/router/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Popconfirm, Tag, message } from "antd";
import Table, { type ColumnsType } from "antd/es/table";
import type { UserInfo } from "#/entity";
import { BasicStatus } from "#/enum";

export default function RolePage() {
	const { push } = useRouter();
	const pathname = usePathname();
	const queryClient = useQueryClient();

	const { data: users, isLoading } = useQuery({
		queryKey: ["users"],
		queryFn: () => userService.getUserList(),
	});

	const deleteUserMutation = useMutation({
		mutationFn: (userId: string) => userService.removeUser(userId),
		onSuccess: () => {
			message.success("用户删除成功");

			// Invalidate the query to refetch the user list from the server
			// This ensures the UI is updated with the latest data after deletion
			// Unlike refetch, which manually triggers a refetch, invalidateQueries marks the query as stale and refetches it automatically
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
		onError: () => {
			message.error("删除用户失败");
		},
	});

	const columns: ColumnsType<UserInfo> = [
		{
			title: "Name",
			dataIndex: "name",
			width: 300,
			render: (_, record) => {
				return (
					<div className="flex">
						<img alt="" src={record.avatar} className="h-10 w-10 rounded-full" />
						<div className="ml-2 flex flex-col">
							<span className="text-sm">{record.nickName}</span>
							<span className="text-xs text-text-secondary">{record.email}</span>
						</div>
					</div>
				);
			},
		},
		{
			title: "Status",
			dataIndex: "status",
			align: "center",
			width: 120,
			render: (status) => (
				<Tag color={status === BasicStatus.DISABLE ? "error" : "success"}>
					{status === BasicStatus.DISABLE ? "Disable" : "Enable"}
				</Tag>
			),
		},
		{
			title: "Action",
			key: "operation",
			align: "center",
			width: 100,
			render: (_, record) => (
				<div className="flex w-full justify-center text-gray-500">
					<IconButton
						onClick={() => {
							push(`${pathname}/${record.id}`);
						}}
					>
						<Iconify icon="mdi:card-account-details" size={18} />
					</IconButton>
					<IconButton onClick={() => {}}>
						<Iconify icon="solar:pen-bold-duotone" size={18} />
					</IconButton>
					<Popconfirm
						title="Delete the User"
						okText="Yes"
						cancelText="No"
						placement="left"
						onConfirm={() => deleteUserMutation.mutate(record.id)}
					>
						<IconButton>
							<Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
						</IconButton>
					</Popconfirm>
				</div>
			),
		},
	];

	return (
		<Card
			title="User List"
			extra={
				<Button type="primary" onClick={() => {}}>
					New
				</Button>
			}
		>
			<Table
				rowKey="id"
				size="small"
				scroll={{ x: "max-content" }}
				pagination={false}
				columns={columns}
				dataSource={users}
				loading={isLoading}
			/>
		</Card>
	);
}
