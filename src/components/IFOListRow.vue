<template>
    <el-row style="padding-bottom: 14px; font-size: 14px; font-weight: 600;" type="flex" align="top">
        <el-col :span="24">
            <div style="border: 1px solid #EBEEF5; border-radius: 14px;">
                 <el-row :gutter="20" class="farm-row" style="margin-left: 0; margin-right: 0;" type="flex" align="middle">
                    <el-col :span="7" style="font-weight: bold;">
                        <img :src="images[project.tokenLogo]" :alt="project.name" />{{project.tokenName}}
                    </el-col> 
                    <el-col :span="7" style="font-weight: bold;">
                        <div v-for="type in project.accessTypes" :key="type" class="accessType"> {{type}} </div>
                    </el-col> 
                    <el-col :span="5" style="font-weight: bold; text-align: right;">
                        {{vueNumberFormat(project.poolSize)}}
                    </el-col> 
                    <el-col :span="5" style="font-weight: bold; text-align: right;">
                        <IFOTimeBubble :date="new Date(project.startDate)" :endDate="new Date(project.endDate)" />
                    </el-col> 
                 </el-row>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import IFOTimeBubble from './IFOTimeBubble.vue'
import {importAll} from '../lib/JsonHelper'
;

export default {
    
    name: "IFOListRow",
    data: ()=> ({
        images: importAll(require.context('../assets/project_images', false, /\.(png|jpe?g|svg)$/))
    }),
    components: { IFOTimeBubble },
    props: ['project'],

}
</script>
<style scoped>
    .accessType {
        display: inline-block;
        margin-right: 15px;
    }
</style>