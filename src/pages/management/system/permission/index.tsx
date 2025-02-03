import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Card, Popconfirm, Tag, message } from "antd";
import Table, { type ColumnsType } from "antd/es/table";
import { isNil } from "ramda";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import permissionService from "@/api/services/permissionService";
import { IconButton, Iconify, SvgIcon } from "@/components/icon";

import PermissionModal, { type PermissionModalProps } from "./permission-modal";

import type { Permission } from "#/entity";
import { PermissionType } from "#/enum";

const defaultPermissionValue: Permission = {
	id: "",
	parentId: "",
	name: "",
	label: "",
	route: "",
	component: "",
	icon: "",
	hide: false,
	type: PermissionType.CATALOGUE,
};
export default function PermissionPage() {
	const { data: permissions, refetch } = useQuery({
		queryKey: ["permissions"],
		queryFn: () => permissionService.getPermissionList(),
	});

	const deletePermissionMutation = useMutation({
		mutationFn: (id: string) => {
			return permissionService.deletePermission(id);
		},
		onSuccess() {
			message.success("操作成功");
			refetch();
		},
	});

	const { t } = useTranslation();

	const [permissionModalProps, setPermissionModalProps] = useState<PermissionModalProps>({
		formValue: { ...defaultPermissionValue },
		title: "",
		show: false,
		onCancel: (refresh = false) => {
			setPermissionModalProps((prev) => ({ ...prev, show: false }));
			if (refresh) {
				refetch();
			}
		},
	});
	const columns: ColumnsType<Permission> = [
		{
			title: "Name",
			dataIndex: "name",
			width: 300,
			render: (_, record) => <div>{t(record.label)}</div>,
		},
		{
			title: "Type",
			dataIndex: "type",
			width: 60,
			render: (_, record) => <Tag color="processing">{PermissionType[record.type]}</Tag>,
		},
		{
			title: "Icon",
			dataIndex: "icon",
			width: 60,
			render: (icon: string) => {
				if (isNil(icon)) return "";
				if (icon.startsWith("ic")) {
					return <SvgIcon icon={icon} size={18} className="ant-menu-item-icon" />;
				}
				return <Iconify icon={icon} size={18} className="ant-menu-item-icon" />;
			},
		},
		{
			title: "Component",
			dataIndex: "component",
		},
		{ title: "Order", dataIndex: "order", width: 60 },
		{
			title: "Action",
			key: "operation",
			align: "center",
			width: 100,
			render: (_, record) => (
				<div className="flex w-full justify-end text-gray">
					{record?.type === PermissionType.CATALOGUE && (
						<IconButton onClick={() => onCreate(record.id)}>
							<Iconify icon="gridicons:add-outline" size={18} />
						</IconButton>
					)}
					<IconButton onClick={() => onEdit(record)}>
						<Iconify icon="solar:pen-bold-duotone" size={18} />
					</IconButton>
					<Popconfirm
						title="Delete the Permission"
						onConfirm={() => deletePermissionMutation.mutate(record.id)}
						okText="Yes"
						cancelText="No"
						placement="left"
					>
						<IconButton>
							<Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
						</IconButton>
					</Popconfirm>
				</div>
			),
		},
	];

	const onCreate = (parentId?: string) => {
		setPermissionModalProps((prev) => ({
			...prev,
			show: true,
			...defaultPermissionValue,
			title: t("common.createText"),
			formValue: { ...defaultPermissionValue, parentId: parentId ?? "" },
		}));
	};

	const onEdit = (formValue: Permission) => {
		setPermissionModalProps((prev) => ({
			...prev,
			show: true,
			title: t("common.editText"),
			formValue,
		}));
	};
	return (
		<Card
			title="Permission List"
			extra={
				<Button type="primary" onClick={() => onCreate()}>
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
				dataSource={permissions}
			/>

			<PermissionModal {...permissionModalProps} />
		</Card>
	);
}
