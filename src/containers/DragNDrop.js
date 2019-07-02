import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { withPlugins } from '../extend/withPlugins';
import { DragNDrop } from '../components/DragNDrop';
import * as actions from '../state/actions';

/** */
const mapDispatchToProps = {
  addWindow: actions.addWindow,
};

const enhance = compose(
  withTranslation(),
  withStyles({}),
  connect(null, mapDispatchToProps),
  withPlugins('DragNDrop'),
  // further HOC go here
);

export default enhance(DragNDrop);
