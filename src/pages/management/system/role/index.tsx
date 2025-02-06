import { Button, Card, Popconfirm, message } from "antd";
import Table, { type ColumnsType } from "antd/es/table";
import { useState } from "react";

import { IconButton, Iconify } from "@/components/icon";

import { RoleModal, type RoleModalProps } from "./role-modal";

import roleService from "@/api/services/roleService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { Role } from "#/entity";

const DEFAULE_ROLE_VALUE: Role = {
	id: "",
	name: "",
	menuIds: [],
};
export default function RolePage() {
	const { data: roles, refetch } = useQuery({
		queryKey: ["roles"],
		queryFn: () => roleService.getRoleList(),
	});

	const deleteRoleMutation = useMutation({
		mutationFn: (id: string) => {
			return roleService.deleteRole(id);
		},
		onSuccess() {
			message.success("操作成功");
			refetch();
		},
	});

	const { t } = useTranslation();

	const [roleModalProps, setRoleModalProps] = useState<RoleModalProps>({
		formValue: { ...DEFAULE_ROLE_VALUE },
		title: "",
		show: false,
		onCancel: (refresh = false) => {
			setRoleModalProps((prev) => ({ ...prev, show: false }));
			if (refresh) {
				refetch();
			}
		},
	});
	const columns: ColumnsType<Role> = [
		{
			title: "Name",
			dataIndex: "name",
			width: 300,
		},
		{
			title: "Action",
			key: "operation",
			align: "center",
			width: 100,
			render: (_, record) => (
				<div className="flex w-full justify-center text-gray">
					<IconButton onClick={() => onEdit(record)}>
						<Iconify icon="solar:pen-bold-duotone" size={18} />
					</IconButton>
					<Popconfirm
						title="Delete the Role"
						onConfirm={() => deleteRoleMutation.mutate(record.id)}
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

	const onCreate = () => {
		setRoleModalProps((prev) => ({
			...prev,
			show: true,
			title: t("common.createText"),
			formValue: {
				...prev.formValue,
				...DEFAULE_ROLE_VALUE,
			},
		}));
	};

	const onEdit = (formValue: Role) => {
		setRoleModalProps((prev) => ({
			...prev,
			show: true,
			title: t("common.editText"),
			formValue,
		}));
	};

	return (
		<Card
			title="Role List"
			extra={
				<Button type="primary" onClick={onCreate}>
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
				dataSource={roles}
			/>

			<RoleModal {...roleModalProps} />
		</Card>
	);
}
