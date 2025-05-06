import React from 'react';
import ReactECharts from 'echarts-for-react';

interface CategoryData {
  category: string;
  count: number;
}

interface CategoryChartProps {
  data: CategoryData[];
}

const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  const option = {
    title: {
      text: 'Phân bố Category',
      subtext: 'Dữ liệu từ mô hình IFC',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.category),
      axisLabel: {
        rotate: 45, // Xoay label cho rõ hơn nếu nhiều category
        interval: 0,
        fontSize: 12,
      },
    },
    yAxis: {
      type: 'value',
      name: 'Số lượng Name',
    },
    series: [
      {
        name: 'Số lượng',
        type: 'bar',
        data: data.map(item => item.count),
        itemStyle: {
          color: '#00CFFF',
        },
        barMaxWidth: 30,
      },
    ],
  };

  return (
    <div style={{ width: '100%', height: '450px' }}>
      <ReactECharts option={option} notMerge={true} lazyUpdate={true} />
    </div>
  );
};

export default CategoryChart;
