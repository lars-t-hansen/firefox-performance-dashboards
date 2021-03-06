import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Loadable from 'react-loadable';
import Footer from '../Footer';
import Navigation from '../Navigation';
import PerfherderGraph from '../PerfherderGraph';
import { queryInfo } from '../../config';
import Loading from '../Loading';

const sortByLabel = (a, b) => (a.label <= b.label ? -1 : 1);

const styles = () => ({
  container: {
    fontFamily: 'Roboto',
  },
});

const LoadableEmptyState = Loadable({
  loader: () => import(/* webpackChunkName: 'EmptyState' */ '../EmptyState'),
  loading: Loading,
});

// eslint-disable-next-line
class App extends Component {
  render() {
    const {
      classes, category, benchmark, viewConfig, viewPlatform, dayRange,
    } = this.props;
    const benchmarks = queryInfo(viewConfig, benchmark, category);
    return (
      <div className={classes.container}>
        {(Object.values(benchmarks).length !== 0)
        && (
        <Navigation
          platform={viewPlatform}
          category={category}
          benchmark={benchmark}
          dayRange={dayRange}
        />
        )}
        {Object.values(benchmarks).length ? Object.values(benchmarks).sort(sortByLabel).map(({
          benchmarkUID, compare, label, includeSubtests, yLabel,
        }) => (
          <div key={label}>
            <PerfherderGraph
              extraLink={`/${viewPlatform}/${benchmarkUID}?numDays=${dayRange}`}
              title={label}
              series={Object.values(compare)}
              includeSubtests={includeSubtests}
              dayRange={dayRange}
              yLabel={yLabel}
            />
          </div>
        )) : <LoadableEmptyState text="Category not available for the selected Platform" />}
        <Footer />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  benchmark: PropTypes.string.isRequired,
  viewConfig: PropTypes.shape({
    label: PropTypes.string.isRequired,
    platform: PropTypes.arrayOf(PropTypes.string),
    categories: PropTypes.shape({}).isRequired,
  }).isRequired,
  viewPlatform: PropTypes.string.isRequired,
  dayRange: PropTypes.number.isRequired,
};

export default withStyles(styles)(App);
