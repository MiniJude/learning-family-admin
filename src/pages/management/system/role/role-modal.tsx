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

	const handleFinish = (values: any) => {
		Reflect.set(values, "menuIds", checkedKeys);
		if (title === t("common.createText")) {
			createRoleMutation.mutate(values);
		} else if (title === t("common.editText")) {
			updateRoleMutation.mutate({ ...values, id: formValue.id });
		}
	};

	const permissions = useUserPermission();

	const [checkedKeys, setCheckedKeys] = useState<number[]>(formValue.menuIds ?? []);
	const handleCheck = (checkedKeysValue: any) => {
		setCheckedKeys(checkedKeysValue);
	};

	/*************  ✨ Codeium Command ⭐  *************/
	/**
	 * Resets the form to the initial values and resets the checked tree keys to the form value's menuIds.
	 */
	/******  c99d7d3c-4e40-42d9-8508-c5cd8ecf2188  *******/
	const onReset = () => {
		form.resetFields();
		setCheckedKeys(formValue.menuIds ?? []);
	};

	useEffect(() => {
		form.setFieldsValue({ ...formValue });
		setCheckedKeys(formValue.menuIds ?? []);
	}, [formValue, form]);

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
						checkedKeys={checkedKeys}
						treeData={permissions}
						fieldNames={{
							key: "id",
							children: "children",
							title: "name",
						}}
						onCheck={handleCheck}
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
