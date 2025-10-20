import ComplaintForm from '../../domains/Complaint/components/ComplaintForm/ComplaintForm'
import Loading from '../../components/Loading'
import React from 'react'
import useWidgetContext from '../../contexts/Widget/useWidgetContext'

interface WidgetProps {
  redirectPath?: string
}

const Widget: React.FC<WidgetProps> = ({ redirectPath }) => {
  const { loading } = useWidgetContext()

  return (
    <div className="widget-content">
      {loading ? (
        <div style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
          <Loading />
        </div>
      ) : (
        <ComplaintForm redirectPath={redirectPath} />
      )}
    </div>
  )
}

export default Widget
