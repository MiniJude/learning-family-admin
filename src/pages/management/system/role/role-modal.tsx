import { Button, Flex, Form, Input, Modal, Space, Tree, message } from "antd";
import { useEffect, useState } from "react";

import roleService from "@/api/services/roleService";
import { useUserPermission } from "@/store/userStore";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { Role } from "#/entity";

export type RoleModalProps = {
	formValue: Role;
	title: string;
	show: boolean;
	onCancel: (refresh?: boolean) => void;
};

export function RoleModal({ title, show, formValue, onCancel }: RoleModalProps) {
	const [form] = Form.useForm();

	const { t } = useTranslation();

	const createRoleMutation = useMutation<Role, unknown, Role>({
		mutationFn: (data) => {
			return roleService.createRole(data);
		},
		onSuccess() {
			message.success("操作成功");
			onCancel(true);
		},
	});

	const updateRoleMutation = useMutation<Role, unknown, Role>({
		mutationFn: (data) => {
			return roleService.updateRole(data);
		},
		onSuccess() {
			message.success("操作成功");
			onCancel(true);
		},
	});

	const [checkedKeys, setCheckedKeys] = useState<number[]>(formValue.menuIds ?? []);
	const [halfCheckedKeys, setHalfCheckedKeys] = useState<number[]>([]);
	const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

	const handleCheck = ({ checked, halfChecked }: any) => {
		setCheckedKeys(checked);
		setHalfCheckedKeys(halfChecked);
	};

	const handleExpand = (expandedKeys: any[]) => {
		setExpandedKeys(expandedKeys);
	};

	const handleFinish = (values: any) => {
		const allCheckedKeys = [...checkedKeys, ...halfCheckedKeys];
		const uniqueKeys = Array.from(new Set([...allCheckedKeys]));
		Reflect.set(values, "menuIds", uniqueKeys);
		if (title === t("common.createText")) {
			createRoleMutation.mutate(values);
		} else if (title === t("common.editText")) {
			updateRoleMutation.mutate({ ...values, id: formValue.id });
		}
	};

	const permissions = useUserPermission();

	const onReset = () => {
		form.resetFields();
		setCheckedKeys(formValue.menuIds ?? []);
		setHalfCheckedKeys([]);
		setExpandedKeys([]);
	};

	useEffect(() => {
		form.setFieldsValue({ ...formValue });
		const initialCheckedKeys = formValue.menuIds ?? [];
		setCheckedKeys(initialCheckedKeys);
		setHalfCheckedKeys([]);
		const uniqueKeys = Array.from(new Set([...initialCheckedKeys]));
		// @ts-ignore
		setExpandedKeys(uniqueKeys);
	}, [formValue, form, formValue.menuIds]);

	return (
		<Modal forceRender title={title} open={show} onCancel={() => onCancel(true)} footer={null}>
			<Form
				initialValues={formValue}
				form={form}
				onFinish={handleFinish}
				labelCol={{ span: 4 }}
				wrapperCol={{ span: 18 }}
				layout="horizontal"
			>
				<Form.Item<Role> label="Name" name="name" required>
					<Input />
				</Form.Item>

				<Form.Item<Role> label="Permission" name="menuIds">
					<Tree
						checkable
						checkStrictly={true}
						checkedKeys={checkedKeys}
						expandedKeys={expandedKeys}
						treeData={permissions}
						fieldNames={{
							key: "id",
							children: "children",
							title: "name",
						}}
						onCheck={handleCheck}
						onExpand={handleExpand}
					/>
				</Form.Item>

				<Flex justify="center">
					<Space>
						<Button htmlType="button" onClick={onReset}>
							重置
						</Button>
						<Button type="primary" htmlType="submit">
							提交
						</Button>
					</Space>
				</Flex>
			</Form>
		</Modal>
	);
}
