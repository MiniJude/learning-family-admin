import { Pagination as AntPagination } from "antd";
import type { PaginationProps } from "antd";
import { useTranslation } from "react-i18next";

interface CustomPaginationProps extends PaginationProps {
	className?: string;
}

const Pagination = (props: CustomPaginationProps) => {
	const { t } = useTranslation();
	const { total, ...restProps } = props;

	return (
		<AntPagination
			{...restProps}
			total={total}
			showTotal={(total) => t("pagination.total", { total })}
			showSizeChanger
			showQuickJumper
		/>
	);
};

export default Pagination;
