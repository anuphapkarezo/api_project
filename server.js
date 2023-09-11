const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); // Import the cors middleware
const app = express();
const port = 3002; // Or any other port you prefer

app.use(cors()); // Enable CORS for all routes

const pool = new Pool({
    connectionString: 'postgres://postgres:12345@localhost:5432/db_smart_plan',
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to the database', err);
        return;
    }
    console.log('Connected to the database');
    // Perform database operations here...
    client.release();
});

app.get('/api/your-table', async(req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM computer_master_db where id < 3 ', );
        client.release();
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// api save data
app.post("/api/save-data", async(req, res) => {
    try {
        const { field, value, id } = req.body;
        // Perform any necessary validation or data processing here...
        const client = await pool.connect();
        const query = `UPDATE computer_master_db SET ${field} = $1 WHERE id = $2`;
        const values = [value, id];
        const result = await client.query(query, values);
        const rowCount = result.rowCount; // Get the number of affected rows
        client.release();
        console.log(`Data saved successfully. Updated ${rowCount} rows.`);
        res.status(200).json({ message: "Data saved successfully", rowCount });
    } catch (error) {
        console.error("Error saving data", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//API List
app.get("/api/computer-list", async(req, res) => {
    try {
        const client = await pool.connect();
        const userUpdateBy = req.query.user_update_by;

        const result = await client.query(
            "SELECT * FROM computer_master_db WHERE user_update_by = $1 order by department,computer_name", [userUpdateBy]
        );
        client.release();
        res.json(result.rows);
    } catch (error) {
        console.error("Error executing query", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// api for select department filter process

app.get("/api/department-filter-process", async(req, res) => {
    try {
        const client = await pool.connect();
        const { factorySelect, departmentSelect } = req.query;
        // console.log(factorySelect, departmentSelect);
        // console.log(factorySelect == 'All');
        // console.log(departmentSelect != 'All')
        // console.log(factorySelect == 'All' && departmentSelect != 'All');
        if (departmentSelect == "All" && factorySelect == "All") {
            const result = await client.query(
                //กรณีเลือก factory = All และ department All แสดงผล process
                "select distinct cmd.process from computer_master_db cmd order by cmd.process"
            );
            client.release();
            res.json(result.rows);
        } else if (factorySelect == "All" && departmentSelect != "All") {
            //กรณีเลือก factory = All และ department ไม่ใช่ All แสดงผล process
            const result = await client.query(
                "select distinct cmd.process from computer_master_db cmd where cmd.department = $1 order by cmd.process", [departmentSelect]
            );
            client.release();
            res.json(result.rows);
        } else {
            //กรณีเลือก factory ไม่ใช่ All และ department ไม่ใช่ All แสดงผล process
            const result = await client.query(
                "select distinct cmd.process from computer_master_db cmd where cmd.factory = $1 and cmd.department = $2 order by cmd.process", [factorySelect, departmentSelect]
            );
            client.release();
            res.json(result.rows);
        }
    } catch (error) {
        console.error("Error executing query", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// filter factory

app.get("/api/factorylist", async(req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(
            "select distinct cmd.factory from computer_master_db cmd order by cmd.factory"
        );
        client.release();
        res.json(result.rows);
    } catch (error) {
        console.error("Error executing query", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// filter department
app.get("/api/departmentlist", async(req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(
            "select distinct cmd.department  from computer_master_db cmd order by cmd.department"
        );
        client.release();
        res.json(result.rows);
    } catch (error) {
        console.error("Error executing query", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// filter process
app.get("/api/processlist", async(req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(
            "select distinct cmd.process  from computer_master_db cmd order by cmd.process"
        );
        client.release();
        res.json(result.rows);
    } catch (error) {
        console.error("Error executing query", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// filter computer name
app.get("/api/computernamelist", async(req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(
            "select distinct cmd.computer_name  from computer_master_db cmd order by cmd.computer_name"
        );
        client.release();
        res.json(result.rows);
    } catch (error) {
        console.error("Error executing query", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// api for select factory filter department

app.get("/api/factory-filter-deparment", async(req, res) => {
    try {
        const client = await pool.connect();
        const { factorySelect } = req.query;
        if (factorySelect == "All") {
            const result = await client.query(
                "select distinct cmd.department from computer_master_db cmd order by cmd.department"
            );
            client.release();
            res.json(result.rows);
        } else {
            const result = await client.query(
                "select distinct cmd.department from computer_master_db cmd where cmd.factory = $1 order by cmd.department", [factorySelect]
            );
            client.release();
            res.json(result.rows);
        }
    } catch (error) {
        console.error("Error executing query", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// api for select department filter process

app.get("/api/department-filter-process", async(req, res) => {
    try {
        const client = await pool.connect();
        const { factorySelect, departmentSelect } = req.query;
        if (departmentSelect == "All" && factorySelect == "All") {
            const result = await client.query(
                //กรณีเลือก factory = All และ department All แสดงผล process
                "select distinct cmd.process from computer_master_db cmd order by cmd.process"
            );
            client.release();
            res.json(result.rows);
        } else if (factorySelect == "All" && departmentSelect != "All") {
            //กรณีเลือก factory = All และ department ไม่ใช่ All แสดงผล process
            const result = await client.query(
                "select distinct cmd.process from computer_master_db cmd where cmd.department = $1 order by cmd.process", [departmentSelect]
            );
            client.release();
            res.json(result.rows);
        } else {
            //กรณีเลือก factory ไม่ใช่ All และ department ไม่ใช่ All แสดงผล process
            const result = await client.query(
                "select distinct cmd.process from computer_master_db cmd where cmd.factory = $1 and cmd.department = $2 order by cmd.process", [factorySelect, departmentSelect]
            );
            client.release();
            res.json(result.rows);
        }
    } catch (error) {
        console.error("Error executing query", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// api for select process filter computer_name

app.get("/api/computer-list-fac-dep-proc", async(req, res) => {
    try {
        const client = await pool.connect();
        const {
            factorySelect,
            departmentSelect,
            processSelect,
        } = req.query;
        if (
            factorySelect == "All" &&
            departmentSelect == "All" &&
            processSelect == "All"
        ) {
            const result = await client.query(
                "select * from computer_master_db cmd order by cmd.department,cmd.computer_name"
            );
            client.release();
            res.json(result.rows);
        } else if (
            factorySelect != "All" &&
            departmentSelect == "All" &&
            processSelect == "All"
        ) {
            const result = await client.query(
                "select * from computer_master_db cmd where cmd.factory = $1 order by cmd.department,cmd.computer_name", [factorySelect]
            );
            client.release();
            res.json(result.rows);
        } else if (
            factorySelect == "All" &&
            departmentSelect != "All" &&
            processSelect == "All"
        ) {
            const result = await client.query(
                "select * from computer_master_db cmd where cmd.department = $1 order by cmd.department,cmd.computer_name", [departmentSelect]
            );
            client.release();
            res.json(result.rows);
        } else if (
            factorySelect == "All" &&
            departmentSelect == "All" &&
            processSelect != "All"
        ) {
            const result = await client.query(
                "select * from computer_master_db cmd where cmd.process = $1 order by cmd.department,cmd.computer_name", [processSelect]
            );
            client.release();
            res.json(result.rows);
        } else if (
            factorySelect != "All" &&
            departmentSelect != "All" &&
            processSelect == "All"
        ) {
            const result = await client.query(
                "select * from computer_master_db cmd where cmd.factory = $1 and cmd.department = $2 order by cmd.department,cmd.computer_name", [factorySelect, departmentSelect]
            );
            client.release();
            res.json(result.rows);
        } else if (
            factorySelect == "All" &&
            departmentSelect != "All" &&
            processSelect != "All"
        ) {
            const result = await client.query(
                "select * from computer_master_db cmd where cmd.department = &=$1 and cmd.process = $2 order by cmd.department,cmd.computer_name", [departmentSelect, processSelect]
            );
            client.release();
            res.json(result.rows);
        } else {
            console.log(
                "computer_name",
                "else",
                factorySelect,
                departmentSelect,
                processSelect
            );
            const result = await client.query(
                "select * from computer_master_db cmd where cmd.factory = $1 and cmd.department = $2 and cmd.process = $3 order by cmd.department,cmd.computer_name", [factorySelect, departmentSelect, processSelect]
            );
            client.release();
            res.json(result.rows);
        }
    } catch (error) {
        console.error("Error executing query", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//API List
app.get("/api/total_pc_fac_dep", async(req, res) => {
    try {
        const client = await pool.connect();
        const {
            factorySelect,
            departmentSelect
        } = req.query;
        if (
            factorySelect == "All" &&
            departmentSelect == "All"
        ) {
            const result = await client.query(
                "select cmd.factory,cmd.department,cmd.process, count(cmd.factory)  from computer_master_db cmd where cmd.factory notnull group by cmd.factory,cmd.department,cmd.process",
            );
            client.release();
            res.json(result.rows);
        } else if (
            factorySelect != "All" &&
            departmentSelect == "All"
        ) {
            const result = await client.query(
                "select cmd.factory,cmd.department,cmd.process, count(cmd.factory)  from computer_master_db cmd where cmd.factory = $1 group by cmd.factory,cmd.department,cmd.process", [factorySelect]
            );
            client.release();
            res.json(result.rows);
        } else if (
            factorySelect == "All" &&
            departmentSelect != "All"
        ) {
            const result = await client.query(
                "select cmd.factory,cmd.department,cmd.process, count(cmd.factory)  from computer_master_db cmd where cmd.department = $1 group by cmd.factory,cmd.department,cmd.process", [departmentSelect]
            );
            client.release();
            res.json(result.rows);
        } else if (
            factorySelect != "All" &&
            departmentSelect != "All"
        ) {
            const result = await client.query(
                "select cmd.factory,cmd.department,cmd.process, count(cmd.factory)  from computer_master_db cmd where cmd.factory = $1 and cmd.department = $2 group by cmd.factory,cmd.department,cmd.process", [factorySelect, departmentSelect]
            );
            client.release();
            res.json(result.rows);
        }
    } catch (error) {
        console.error("Error executing query", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//API List Trainging
app.get("/api/fcpowipfg", async(req, res) => {
    try {
        const client = await pool.connect();
        const week = req.query.week;
        const prd_name = req.query.prd_name;

        const result = await client.query(
            'select * from pln_fc_wip_po_fg where pln_fc_wip_po_fg."WK" = $1 and pln_fc_wip_po_fg."PRD_NAME" = $2', [week, prd_name]
        );
        client.release();
        res.json(result.rows);
    } catch (error) {
        console.error("Error executing query", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//////////////////////////////////API For Plannig Forecast Vs PO/////////////////////////////////////////////
//ProductList for Autocomplete
app.get("/api/productlist", async(req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(
            `select * from 
            (select DISTINCT pln_fc.prd_name 
            from pln_fc
            union
            select distinct pln_po_wip_fg.prd_name 
            from pln_po_wip_fg
            union
            SELECT distinct 
            case when substring(DB1.prd_name , 4 , 1) = 'Z' then left(DB1.prd_name , 10)
            else left(DB1.prd_name , 8) end as prd_name
            FROM (
                SELECT DISTINCT pln_fc.prd_name 
                FROM pln_fc
                UNION
                SELECT DISTINCT pln_po_wip_fg.prd_name 
                FROM pln_po_wip_fg
            ) DB1 ) DB
            order by DB.prd_name `
        );
        client.release();
        res.json(result.rows);
    } catch (error) {
        console.error("Error executing query", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Plannig Forecast Vs PO
//SeriesList for Autocomplete
app.get("/api/serieslist", async(req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(
            `select distinct pln_fc.prd_series 
            from pln_fc
            order by pln_fc.prd_series`
        );
        client.release();
        res.json(result.rows);
    } catch (error) {
        console.error("Error executing query", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Plannig Forecast Vs PO
//get-week for head table and foreach ddata
app.get("/api/get-week", async(req, res) => {
    try {
        const client = await pool.connect();
        const prd_name = req.query.prd_name;
        // const prd_name = req.query.prd_name;

        const result = await client.query(
            `SELECT DISTINCT 
            pf.wk,
            TO_CHAR(TO_DATE('20' || SUBSTR(pf.wk, 3, 2) || TO_CHAR(CAST(SUBSTR(pf.wk, 5) AS INTEGER), 
            'FM00'),'YYYYWW')+ INTERVAL '1 DAY', 'DD-Mon-YY') AS mon_date
            FROM pln_fc pf
            WHERE SUBSTR(pf.wk, 3, 4) >= (SELECT SUBSTR(TO_CHAR(CURRENT_DATE - INTERVAL '84 DAYS', 'YYYYWW'), 3, 4) AS result_year_week)
            AND SUBSTR(pf.wk, 3, 4) <= (SELECT SUBSTR(TO_CHAR(CURRENT_DATE + INTERVAL '70 DAYS', 'YYYYWW'), 3, 4))
            ORDER BY pf.wk`
        );
        client.release();
        res.json(result.rows);
    } catch (error) {
        console.error("Error executing query", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Plannig Forecast Vs PO
//Filter_Forecast_by_Product-Series
app.get("/api/filter-fc-by-product-series", async(req, res) => {
    try {
        const client = await pool.connect();
        const prd_name = req.query.prd_name;
        const prd_series = req.query.prd_series;

        if (prd_series == 'Series') {
            // const prd_name = req.query.prd_name;
            const result = await client.query(
                `select pf.pfd_period_no , pf.wk , sum(qty_fc) AS qty_fc
                from pln_fc pf
                where pf.prd_name like $1 || '%'
                and pf.pfd_period_no <= (SELECT substring(TO_CHAR(CURRENT_DATE + INTERVAL '70 days', 'YYYYWW'),1,6))
                and pf.pfd_period_no >= (SELECT substring(TO_CHAR(CURRENT_DATE - INTERVAL '84 days', 'YYYYWW'),1,6))
                group by pf.pfd_period_no , pf.wk
                order by pf.pfd_period_no , pf.wk `, [prd_name]
            );
            client.release();
            res.json(result.rows);
        } else {
            // const prd_name = req.query.prd_name;
            const result = await client.query(
                `SELECT
                pf.pfd_period_no,
                pf.wk,
                pf.prd_series,
                SUM(qty_fc) AS qty_fc
                FROM pln_fc pf
                where pf.prd_series = $1
                and pf.pfd_period_no <= (SELECT substring(TO_CHAR(CURRENT_DATE + INTERVAL '70 days', 'YYYYWW'),1,6))
                and pf.pfd_period_no >= (SELECT substring(TO_CHAR(CURRENT_DATE - INTERVAL '84 days', 'YYYYWW'),1,6))
                GROUP BY pf.pfd_period_no, pf.wk, pf.prd_series
                order by pf.pfd_period_no , pf.wk , pf.prd_series `, [prd_series]
            );
            client.release();
            res.json(result.rows);
        }
    } catch (error) {
        console.error("Error executing query", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Plannig Forecast Vs PO
//Filter_PO_all_by_Product-Series
app.get("/api/filter-po-all-product-series", async(req, res) => {
    try {
        const client = await pool.connect();
        const prd_name = req.query.prd_name;
        const prd_series = req.query.prd_series;

        if (prd_series == 'Series') {
            // const prd_name = req.query.prd_name;
            const result = await client.query(
                `select ppwf.wk , 
                sum(ppwf.qty_rec) as qty_rec , 
                sum(ppwf.qty_due) as qty_due , 
                sum(ppwf.qty_fg) as qty_fg , 
                sum(ppwf.qty_wip) as qty_wip
                from  pln_po_wip_fg ppwf 
                where ppwf.prd_name like $1 || '%'
                and substring(ppwf.wk,3,4)  >= (SELECT substring(TO_CHAR(CURRENT_DATE - INTERVAL '84 days', 'YYYYWW'),3,4))
                and substring(ppwf.wk,3,4)  <= (SELECT substring(TO_CHAR(CURRENT_DATE + INTERVAL '70 days', 'YYYYWW'),3,4))
                group by ppwf.wk
                order by ppwf.wk`, [prd_name]
            );
            client.release();
            res.json(result.rows);
        } else {
            // const prd_name = req.query.prd_name;
            const result = await client.query(
                `SELECT
                ppwf.wk,
                ppwf.pd_series,
                SUM(qty_rec) AS qty_rec,
                SUM(qty_due) AS qty_due,
                SUM(qty_fg) AS qty_fg ,
                SUM(qty_wip) AS qty_wip
                FROM pln_po_wip_fg ppwf
                where ppwf.pd_series = $1
                and substring(ppwf.wk,3,4)  >= (SELECT substring(TO_CHAR(CURRENT_DATE - INTERVAL '84 days', 'YYYYWW'),3,4))
                and substring(ppwf.wk,3,4)  <= (SELECT substring(TO_CHAR(CURRENT_DATE + INTERVAL '70 days', 'YYYYWW'),3,4))
                GROUP BY ppwf.wk, ppwf.pd_series
                order by ppwf.wk , ppwf.pd_series`, [prd_series]
            );
            client.release();
            res.json(result.rows);
        }
    } catch (error) {
        console.error("Error executing query", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Plannig Forecast Vs PO
//Filter_PO_bal_only
app.get("/api/filter-po-bal-product-series", async(req, res) => {
    try {
        const client = await pool.connect();
        const prd_name = req.query.prd_name;
        const prd_series = req.query.prd_series;

        if (prd_series == 'Series') {
            // const prd_name = req.query.prd_name;
            const result = await client.query(
                `SELECT 'WK' || right(TO_CHAR(CURRENT_DATE, 'YYYY'), 2) || TO_CHAR(CURRENT_DATE, 'WW') AS WK, 
                SUM(ppwf.qty_bal) AS qty_bal
                FROM pln_po_wip_fg ppwf 
                WHERE ppwf.prd_name LIKE $1 || '%'
                AND LEFT(ppwf.wk, 2) >= (SELECT LEFT(TO_CHAR(CURRENT_DATE - INTERVAL '84 days', 'YYYYWW'), 2))
                GROUP BY 'WK' || LEFT(TO_CHAR(CURRENT_DATE, 'YYYY'), 2) || TO_CHAR(CURRENT_DATE, 'WW')`, [prd_name]
            );
            client.release();
            res.json(result.rows);
        } else {
            // const prd_name = req.query.prd_name;
            const result = await client.query(
                `SELECT 'WK' || right(TO_CHAR(CURRENT_DATE, 'YYYY'), 2) || TO_CHAR(CURRENT_DATE, 'WW') AS WK, 
                SUM(ppwf.qty_bal) AS qty_bal
                FROM pln_po_wip_fg ppwf 
                WHERE ppwf.pd_series LIKE $1 || '%'
                AND LEFT(ppwf.wk, 2) >= (SELECT LEFT(TO_CHAR(CURRENT_DATE - INTERVAL '84 days', 'YYYYWW'), 2))
                GROUP BY 'WK' || LEFT(TO_CHAR(CURRENT_DATE, 'YYYY'), 2) || TO_CHAR(CURRENT_DATE, 'WW')`, [prd_series]
            );
            client.release();
            res.json(result.rows);
        }
    } catch (error) {
        console.error("Error executing query", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Plannig Forecast Vs PO
//Filter_actual_ship_summary
app.get("/api/filter-actual-ship-summary-product-series", async(req, res) => {
    try {
        const client = await pool.connect();
        const prd_name = req.query.prd_name;
        const prd_series = req.query.prd_series;

        if (prd_series == 'Series') {
            // const prd_name = req.query.prd_name;
            const result = await client.query(
                `select pass.wk , sum(qty_ship) AS qty_ship
                from pln_actual_ship_summary pass 
                where pass.prd_name like $1 || '%'
                and substring(pass.wk,3,4)  >= (SELECT substring(TO_CHAR(CURRENT_DATE - INTERVAL '84 days', 'YYYYWW'),3,4))
                and substring(pass.wk,3,4)  <= (SELECT substring(TO_CHAR(CURRENT_DATE + INTERVAL '70 days', 'YYYYWW'),3,4))
                group by pass.wk
                order by pass.wk`, [prd_name]
            );
            client.release();
            res.json(result.rows);
        } else {
            // const prd_name = req.query.prd_name;
            const result = await client.query(
                `select pass.wk , sum(qty_ship) AS qty_ship
                from pln_actual_ship_summary pass 
                where pass.prd_series like $1 || '%'
                and substring(pass.wk,3,4)  >= (SELECT substring(TO_CHAR(CURRENT_DATE - INTERVAL '84 days', 'YYYYWW'),3,4))
                and substring(pass.wk,3,4)  <= (SELECT substring(TO_CHAR(CURRENT_DATE + INTERVAL '70 days', 'YYYYWW'),3,4))
                group by pass.wk
                order by pass.wk`, [prd_series]
            );
            client.release();
            res.json(result.rows);
        }
    } catch (error) {
        console.error("Error executing query", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Plannig Forecast Vs PO
//Filter_product_for_show
app.get("/api/filter-show-product-series", async(req, res) => {
    try {
        const client = await pool.connect();
        const prd_name = req.query.prd_name;
        const prd_series = req.query.prd_series;

        if (prd_series == 'Series') {
            // const prd_name = req.query.prd_name;
            const result = await client.query(
                `select distinct ppwf.prd_name 
                from  pln_po_wip_fg ppwf 
                where ppwf.prd_name like $1 || '%'
                and substring(ppwf.wk,3,4)  >= (SELECT substring(TO_CHAR(CURRENT_DATE - INTERVAL '84 days', 'YYYYWW'),3,4))
                and substring(ppwf.wk,3,4)  <= (SELECT substring(TO_CHAR(CURRENT_DATE + INTERVAL '70 days', 'YYYYWW'),3,4))`, [prd_name]
            );
            client.release();
            res.json(result.rows);
        } else {
            // const prd_name = req.query.prd_name;
            //     const result = await client.query(
            //         `select distinct ppwf.prd_name 
            //         from  pln_po_wip_fg ppwf 
            //         where ppwf.prd_name like $1 || '%'
            //         and substring(ppwf.wk,3,4)  >= (SELECT substring(TO_CHAR(CURRENT_DATE - INTERVAL '84 days', 'YYYYWW'),3,4))
            //         and substring(ppwf.wk,3,4)  <= (SELECT substring(TO_CHAR(CURRENT_DATE + INTERVAL '70 days', 'YYYYWW'),3,4))`, [prd_series]
            //     );
            //     client.release();
            //     res.json(result.rows);
        }
    } catch (error) {
        console.error("Error executing query", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Plannig Forecast Vs PO
//Filter_product_for_show
app.get("/api/filter-fc-diff-prev-curr", async(req, res) => {
    try {
        const client = await pool.connect();
        const prd_name = req.query.prd_name;
        const prd_series = req.query.prd_series;

        if (prd_series == 'Series') {
            // const prd_name = req.query.prd_name;
            const result = await client.query(
                `select DB_ALL.pfd_period_no,
                DB_ALL.wk,
                DB_ALL.prd_name,
                case when (select max(pf.pfd_period_no) from pln_fc pf 
                            where pf.pfd_period_no = (SELECT substring(TO_CHAR(CURRENT_DATE - INTERVAL '0 days', 'YYYYWW'), 1, 6))) is null --check current period no data
                            and DB_ALL.pfd_period_no = (SELECT substring(TO_CHAR(CURRENT_DATE - INTERVAL '0 days', 'YYYYWW'), 1, 6)) -- check current period 
                            then '0' else DB_ALL.qty_fc end as qty_fc
                from 
                (
                select	'20' || substring(DB_QUE.wk, 3, 4) as pfd_period_no,
                        DB_QUE.wk,
                        DB_QUE.prd_name,
                        sum(DB_QUE.qty_fc) as qty_fc
                from (SELECT
                        pf.pfd_period_no,
                        pf.wk,
                        pf.prd_name,
                        pf.qty_fc,
                        NULL as update_datetime,
                        NULL as id
                from pln_fc pf
                where pf.pfd_period_no <= (SELECT substring(TO_CHAR(CURRENT_DATE + INTERVAL '70 days', 'YYYYWW'), 1, 6))
                AND pf.pfd_period_no >= (SELECT substring(TO_CHAR(CURRENT_DATE - INTERVAL '84 days', 'YYYYWW'), 1, 6))
                AND pf.pfd_period_no = '20' || substring(pf.wk, 3, 4)
                AND pf.prd_name like $1 || '%'
                and SUBSTR(pf.wk, 3, 4) <= (SELECT SUBSTR(TO_CHAR(CURRENT_DATE + INTERVAL '0 DAYS', 'YYYYWW'), 3, 4))
                UNION
                select	TO_CHAR(TO_DATE('20' || substring(pf.wk, 3, 4), 'YYYYWW') - INTERVAL '7 days', 'YYYYWW'),
                        pf.wk,
                        pf.prd_name,
                        -pf.qty_fc,
                        pf.update_datetime,
                        pf.id
                from pln_fc pf
                where pf.pfd_period_no <= (SELECT substring(TO_CHAR(CURRENT_DATE + INTERVAL '70 days', 'YYYYWW'), 1, 6))
                AND pf.pfd_period_no >= (SELECT substring(TO_CHAR(CURRENT_DATE - INTERVAL '84 days', 'YYYYWW'), 1, 6))
                AND pf.pfd_period_no = TO_CHAR(TO_DATE('20' || substring(pf.wk, 3, 4), 'YYYYWW') - INTERVAL '7 days', 'YYYYWW')
                AND pf.prd_name like $1 || '%'
                and SUBSTR(pf.wk, 3, 4) <= (SELECT SUBSTR(TO_CHAR(CURRENT_DATE + INTERVAL '0 DAYS', 'YYYYWW'), 3, 4))
                ) DB_QUE
                GROUP by DB_QUE.wk, DB_QUE.prd_name
                union
                select 	DB_QUE.pfd_period_no,
                        DB_QUE.wk,
                        DB_QUE.prd_name,
                        sum(DB_QUE.qty_fc) as qty_fc
                from 
                (select	(SELECT substring(TO_CHAR(CURRENT_DATE - INTERVAL '0 days', 'YYYYWW'), 1, 6)) as pfd_period_no,
                        pf.wk,
                        pf.prd_name,
                        -pf.qty_fc as qty_fc
                from pln_fc pf
                where pf.pfd_period_no >= (SELECT substring(TO_CHAR(CURRENT_DATE - INTERVAL '7 days', 'YYYYWW'), 1, 6))
                and pf.pfd_period_no <= (SELECT substring(TO_CHAR(CURRENT_DATE - INTERVAL '7 days', 'YYYYWW'), 1, 6))
                AND pf.prd_name like $1 || '%'
                and SUBSTR(pf.wk, 3, 4) >= (SELECT SUBSTR(TO_CHAR(CURRENT_DATE + INTERVAL '7 DAYS', 'YYYYWW'), 3, 4))
                and SUBSTR(pf.wk, 3, 4) <= (SELECT SUBSTR(TO_CHAR(CURRENT_DATE + INTERVAL '70 DAYS', 'YYYYWW'), 3, 4))
                union
                select	pf.pfd_period_no,
                        pf.wk,
                        pf.prd_name,
                        pf.qty_fc as qty_fc
                from pln_fc pf
                where pf.pfd_period_no >= (SELECT substring(TO_CHAR(CURRENT_DATE - INTERVAL '0 days', 'YYYYWW'), 1, 6))
                AND pf.prd_name like $1 || '%'
                and SUBSTR(pf.wk, 3, 4) >= (SELECT SUBSTR(TO_CHAR(CURRENT_DATE + INTERVAL '7 DAYS', 'YYYYWW'), 3, 4))
                and SUBSTR(pf.wk, 3, 4) <= (SELECT SUBSTR(TO_CHAR(CURRENT_DATE + INTERVAL '70 DAYS', 'YYYYWW'), 3, 4))) DB_QUE
                group by DB_QUE.pfd_period_no,
                        DB_QUE.wk,
                        DB_QUE.prd_name
                ) DB_ALL
                order by DB_ALL.pfd_period_no
                            ,DB_ALL.wk`, [prd_name]
            );
            client.release();
            res.json(result.rows);
        } else {
            const prd_name = req.query.prd_name;
            const result = await client.query(
                `select 	DB_ALL.pfd_period_no,
                DB_ALL.wk,
                case when (select max(pf.pfd_period_no) from pln_fc pf 
                    where pf.pfd_period_no = (SELECT substring(TO_CHAR(CURRENT_DATE - INTERVAL '0 days', 'YYYYWW'), 1, 6))) is null --check current period no data
                    and DB_ALL.pfd_period_no = (SELECT substring(TO_CHAR(CURRENT_DATE - INTERVAL '0 days', 'YYYYWW'), 1, 6)) -- check current period 
                    then '0' else DB_ALL.qty_fc end as qty_fc
                from 
                (
                --prev=>curr
                SELECT
                    '20' || substring(DB_QUE.wk, 3, 4) as pfd_period_no,
                    DB_QUE.wk,
                    sum(DB_QUE.qty_fc) as qty_fc
                FROM
                (
                    SELECT
                        pf.pfd_period_no,
                        pf.wk,
                        SUM(pf.qty_fc) as qty_fc,
                        NULL as update_datetime,
                        NULL as id
                    FROM pln_fc pf
                    WHERE pf.pfd_period_no <= (SELECT substring(TO_CHAR(CURRENT_DATE + INTERVAL '70 days', 'YYYYWW'), 1, 6))
                    AND pf.pfd_period_no >= (SELECT substring(TO_CHAR(CURRENT_DATE - INTERVAL '84 days', 'YYYYWW'), 1, 6))
                    AND pf.pfd_period_no = '20' || substring(pf.wk, 3, 4)
                    AND pf.prd_series like $1 || '%'
                    AND SUBSTR(pf.wk, 3, 4) <= (SELECT SUBSTR(TO_CHAR(CURRENT_DATE + INTERVAL '0 DAYS', 'YYYYWW'), 3, 4))
                    GROUP BY pf.pfd_period_no, pf.wk
                    UNION
                    SELECT
                        TO_CHAR(TO_DATE('20' || substring(pf.wk, 3, 4), 'YYYYWW') - INTERVAL '7 days', 'YYYYWW'),
                        pf.wk,
                        SUM(-pf.qty_fc) as qty_fc,
                        NULL as update_datetime,
                        NULL as id
                    FROM pln_fc pf
                    WHERE pf.pfd_period_no <= (SELECT substring(TO_CHAR(CURRENT_DATE + INTERVAL '70 days', 'YYYYWW'), 1, 6))
                    AND pf.pfd_period_no >= (SELECT substring(TO_CHAR(CURRENT_DATE - INTERVAL '84 days', 'YYYYWW'), 1, 6))
                    AND pf.pfd_period_no = TO_CHAR(TO_DATE('20' || substring(pf.wk, 3, 4), 'YYYYWW') - INTERVAL '7 days', 'YYYYWW')
                    AND pf.prd_series like $1 || '%'
                    AND SUBSTR(pf.wk, 3, 4) <= (SELECT SUBSTR(TO_CHAR(CURRENT_DATE + INTERVAL '0 DAYS', 'YYYYWW'), 3, 4))
                    GROUP BY pf.pfd_period_no, pf.wk
                ) DB_QUE
                GROUP BY '20' || substring(DB_QUE.wk, 3, 4), DB_QUE.wk
                union
                --curr=>next
                SELECT
                    DB_QUE.pfd_period_no,
                    DB_QUE.wk,
                    sum(DB_QUE.qty_fc) as qty_fc
                from
                (
                SELECT
                    (SELECT substring(TO_CHAR(CURRENT_DATE - INTERVAL '0 days', 'YYYYWW'), 1, 6)) as pfd_period_no,
                    pf.wk,
                    SUM(-pf.qty_fc) as qty_fc,
                    NULL as update_datetime,
                    NULL as id
                FROM pln_fc pf
                WHERE pf.pfd_period_no >= (SELECT substring(TO_CHAR(CURRENT_DATE - INTERVAL '7 days', 'YYYYWW'), 1, 6))
                    AND pf.pfd_period_no <= (SELECT substring(TO_CHAR(CURRENT_DATE - INTERVAL '7 days', 'YYYYWW'), 1, 6))
                    AND pf.prd_series like $1 || '%'
                    AND SUBSTR(pf.wk, 3, 4) >= (SELECT SUBSTR(TO_CHAR(CURRENT_DATE + INTERVAL '7 DAYS', 'YYYYWW'), 3, 4))
                    AND SUBSTR(pf.wk, 3, 4) <= (SELECT SUBSTR(TO_CHAR(CURRENT_DATE + INTERVAL '70 DAYS', 'YYYYWW'), 3, 4))
                GROUP BY pf.pfd_period_no, pf.wk
                UNION
                SELECT
                    pf.pfd_period_no,
                    pf.wk,
                    SUM(pf.qty_fc) as qty_fc,
                    NULL as update_datetime,
                    NULL as id
                FROM pln_fc pf
                WHERE pf.pfd_period_no >= (SELECT substring(TO_CHAR(CURRENT_DATE - INTERVAL '0 days', 'YYYYWW'), 1, 6))
                    AND pf.prd_series like $1 || '%'
                    AND SUBSTR(pf.wk, 3, 4) >= (SELECT SUBSTR(TO_CHAR(CURRENT_DATE + INTERVAL '7 DAYS', 'YYYYWW'), 3, 4))
                    AND SUBSTR(pf.wk, 3, 4) <= (SELECT SUBSTR(TO_CHAR(CURRENT_DATE + INTERVAL '70 DAYS', 'YYYYWW'), 3, 4))
                GROUP BY pf.pfd_period_no, pf.wk) DB_QUE
                GROUP BY DB_QUE.pfd_period_no, DB_QUE.wk
                ) DB_ALL
                order by DB_ALL.pfd_period_no , DB_ALL.wk`, [prd_series]
            );
            client.release();
            res.json(result.rows);
        }
    } catch (error) {
        console.error("Error executing query", error);
        res.status(500).json({ error: "Internal server error" });
    }
});