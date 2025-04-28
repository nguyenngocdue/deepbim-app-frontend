import useScrollRestoration from '@/hooks/useScrollRestoration';
import ConnectorHeading from '@/sections/ConnectorHeading';
import ConnectorMain from '@/sections/ConnectorMain';


const ConnectorPage: React.FC = () => {
  useScrollRestoration();
  return (
    <div className="bg-behind h-svh">
        <ConnectorHeading />
        <ConnectorMain/>
    </div>
  );
};

export default ConnectorPage;
