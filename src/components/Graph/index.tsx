import React from 'react'
import Plot from 'react-plotly.js'

interface GraphComponentProps {
  features?: number[]
  isLoading?: boolean
}

const GraphComponent: React.FC<GraphComponentProps> = ({ 
  features = [], 
  isLoading = false 
}) => {
  // ダミーデータ
  const defaultFeatures = new Array(25).fill(0)
  const displayFeatures = features.length > 0 ? features : defaultFeatures

  // Y軸の範囲
  const maxFeatureValue = Math.max(...displayFeatures)
  const yAxisRange = maxFeatureValue > 100 ? undefined : [0, 100]
  const xLabels = displayFeatures.map((_, index) => `${index + 1}`)

  // HLACマスク画像アノテーション
  const imageAnnotations = displayFeatures.map((_, index) => ({
    source: `${import.meta.env.BASE_URL}bin/hlac_mask/${index}.png`,
    xref: 'x' as const,
    yref: 'paper' as const,
    x: index + 1,
    y: -0.06,
    sizex: 0.9,
    sizey: 0.5,
    xanchor: 'center' as const,
    yanchor: 'middle' as const,
    layer: 'below' as const,
    sizing: 'contain' as const
  }))

  const plotData = [
    {
      x: xLabels,
      y: displayFeatures,
      type: 'bar' as const,
      marker: {
        color: displayFeatures.map(value => 
          value > 0 ? '#2196F3' : '#E0E0E0'
        ),
        line: {
          color: '#1976D2',
          width: 1
        }
      },
      name: '特徴量値'
    }
  ]

  const layout = {
    title: {
      text: 'HLAC特徴量 (25次元)',
      font: {
        size: 18,
        color: '#333'
      }
    },
    xaxis: {
      title: {
        text: 'マスクID',
        font: {
          size: 14,
          color: '#666'
        },
        standoff: 60
      },
      dtick: 1,
      range: [0.5, 25.5]
    },
    yaxis: {
      title: {
        text: '特徴量',
        font: {
          size: 14,
          color: '#666'
        }
      },
      range: yAxisRange,
      rangemode: 'nonnegative' as const
    },
    images: imageAnnotations,
    plot_bgcolor: '#FAFAFA',
    paper_bgcolor: '#FAFAFA',
    margin: {
      l: 60,
      r: 30,
      t: 60,
      b: 180
    },
    showlegend: false,
    font: {
      family: '"Noto Sans JP", Arial, sans-serif'
    }
  }

  const config = {
    displayModeBar: false,
    responsive: true
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#FAFAFA',
      padding: '20px',
      borderLeft: '1px solid #ddd',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      <Plot
        data={plotData}
        layout={layout}
        config={config}
        style={{
          width: '100%',
          height: '100%'
        }}
        useResizeHandler={true}
      />
      
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(250, 250, 250, 0.8)',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #E0E0E0',
            borderTop: '4px solid #2196F3',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{
            color: '#666',
            fontSize: '14px'
          }}>
            特徴量を計算中...
          </div>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      )}
    </div>
  )
}

export default GraphComponent 