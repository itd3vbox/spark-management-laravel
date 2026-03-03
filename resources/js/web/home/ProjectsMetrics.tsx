import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';
import ProgressCircular from '@/components-metrics/progress-circular/ProgressCircular'
import ProjectsProgress from '@/components-metrics/projects-progress/ProjectsProgress'



interface ProjectsMetricsProps
{
    data: any
}


interface ProjectsMetricsState
{
    data: any
}

export default class ProjectsMetrics extends React.Component<ProjectsMetricsProps, ProjectsMetricsState>
{
    refMetricProgress: any
    metricProgress: any
    refMetricProjectsProgress: any
    metricProjectsProgress: any
    resizeObserver: any
    resizeTimeout: any = null

    constructor(props: ProjectsMetricsProps)
    {
        super(props)
        this.state = {
            data: null,
        }

        this.refMetricProgress = React.createRef()
        this.metricProgress = null
        this.refMetricProjectsProgress = React.createRef()
        this.metricProjectsProgress = null
        this.resizeObserver = null
    }

    componentDidMount(): void {
        this.searchProjectsData()
        this.setupProgress()
        this.setupResizeObserver()
    }

    componentDidUpdate(prevProps: ProjectsMetricsProps, prevState: ProjectsMetricsState): void {
        // Progress circular
        if (this.props.data !== prevProps.data && this.metricProgress) {
            const value = this.props.data ?? 0;
            this.metricProgress.data = { ...this.metricProgress.data, value };
            this.metricProgress.refresh();
        }

        // Projects progress
        if (this.state.data !== prevState.data && this.metricProjectsProgress) {
            const projectsData = this.state.data?.data ?? [];
            this.metricProjectsProgress.data = projectsData.map((p: any) => ({
                logo: p.image ?? '/images/project-cube.png',
                name: p.name ?? 'Unnamed Project',
                progress: p.progress_percentage ?? 0
            }));
            this.metricProjectsProgress.refresh();
        }
    }

    async searchProjectsData(url: string = `/search-projects-data`) {
        const formData = { is_asc: false, max: 4 };

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        const csrfToken = tokenMetaTag?.getAttribute('content') ?? '';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            console.log('Projects raw', result);

            this.setState({ data: result.data }); // stocke tout le paginator
        } catch (error) {
            console.error('Error fetch', error);
        }
    }

    setupResizeObserver()
    {
        const element = this.refMetricProjectsProgress.current
        if (!element) return

        this.resizeObserver = new ResizeObserver(() => {

            if (this.resizeTimeout)
            {
                clearTimeout(this.resizeTimeout)
            }

            this.resizeTimeout = setTimeout(() => {
                if (this.metricProjectsProgress)
                {
                    this.metricProjectsProgress.refresh()
                }
            }, 150)

        })

        this.resizeObserver.observe(element)
    }
    
    setupProgress() {
        const value = this.props.data ?? 0;

        if (!this.metricProgress) {
            this.metricProgress = new ProgressCircular({
                element: this.refMetricProgress.current,
                data: { value, label: "Done" }
            });
        }

        if (!this.metricProjectsProgress) {
            const projectsData = this.state.data?.data ?? [];
            this.metricProjectsProgress = new ProjectsProgress({
                element: this.refMetricProjectsProgress.current,
                data: projectsData.map((p: any) => ({
                    logo: p.image ?? '/images/project-cube.png',
                    name: p.name ?? 'Unnamed Project',
                    progress: p.progress_percentage ?? 0
                }))
            });
        }
    }

    handleOnPrev()
    {
        if (this.state.data & this.state.data.prev_page_url)
            this.searchProjectsData(this.state.data.prev_page_url)
    }

    handleOnNext()
    {
        if (this.state.data & this.state.data.next_page_url)
            this.searchProjectsData(this.state.data.next_page_url)
    }

    render()
    {
        return (
            <>
                <div className="metric-progress">
                    <div className="wrapper" ref={ this.refMetricProgress }></div>
                </div>
                <div className="metric-projects-progress">
                    <div className="wrapper" ref={ this.refMetricProjectsProgress }></div>
                </div>
            </>
        )   
    }
}